#!/bin/bash
# ==============================================================================
# SlideForge AI - All-in-One Startup Script
# Starts both the Express Backend API (Port 5000) and Vite Frontend (Port 5173)
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Colors for terminal output
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${PURPLE}======================================================${NC}"
echo -e "${PURPLE}   ✨ Launching SlideForge AI Full-Stack App ✨       ${NC}"
echo -e "${PURPLE}======================================================${NC}"

# 1. Clean up any existing processes on ports 5000 and 5173
echo -e "${CYAN}→ Clearing ports 5000 and 5173...${NC}"
lsof -ti :5000 -ti :5173 | xargs -r kill -9 2>/dev/null || true
sleep 1

# 2. Check if .env files exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo -e "${YELLOW}Notice: backend/.env not found. Copying from .env.example...${NC}"
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

if [ ! -f "$FRONTEND_DIR/.env" ]; then
  echo "VITE_API_URL=http://localhost:5000/api" > "$FRONTEND_DIR/.env"
fi

# 3. Trap exit signals to gracefully stop both servers on Ctrl+C
cleanup() {
  echo -e "\n${YELLOW}→ Shutting down SlideForge AI services...${NC}"
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  lsof -ti :5000 -ti :5173 | xargs -r kill -9 2>/dev/null || true
  echo -e "${GREEN}✓ All services stopped.${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 4. Start Backend Server
echo -e "${CYAN}→ Starting Backend (Node/Express with Gemini 3.8 Flash)...${NC}"
cd "$BACKEND_DIR"
node src/server.js &
BACKEND_PID=$!

# Wait briefly for backend to bind port 5000
sleep 2

# 5. Start Frontend Dev Server
echo -e "${CYAN}→ Starting Frontend (React + Vite)...${NC}"
cd "$FRONTEND_DIR"
npm run dev -- --host &
FRONTEND_PID=$!

# Wait for frontend to spin up
sleep 2

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   🚀 SlideForge AI is LIVE and Ready!               ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "   🖥️  Frontend URL: ${CYAN}http://localhost:5173${NC}"
echo -e "   🔌 Backend API:  ${CYAN}http://localhost:5000/api/health${NC}"
echo -e "   🤖 AI Model:     ${PURPLE}Google Gemini 3.8 Flash (Active)${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "${YELLOW}Press Ctrl+C at any time to stop both servers.${NC}\n"

# Wait on background processes
wait $BACKEND_PID $FRONTEND_PID
