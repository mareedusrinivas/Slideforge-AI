# SlideForge AI — AI-Powered Presentation Editor

![SlideForge AI](https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80)

**SlideForge AI** is a modern, responsive, full-stack presentation editor inspired by the layout flexibility of Google Slides, the visual craft of Canva, and the contextual speed of modern AI productivity tools.

Built for seamless productivity, SlideForge combines direct canvas manipulation (drag, 8-handle resize, inline text editing, shape styling, alignment snapping) with a persistent, context-aware AI Co-Pilot that returns **actionable, structured canvas operations**.

---

## 🌟 Key Features

### 1. Interactive 16:9 Presentation Canvas
- **Dynamic 16:9 Aspect Ratio**: Responsive canvas scaling automatically adjusts to any screen size while preserving exact coordinate geometry.
- **Direct Canvas Manipulation**: Add, select, drag, rotate, resize, and delete headings, body text, shapes, and images.
- **8-Directional Resize Handles**: Full control over element geometry with minimum constraint protections.
- **Inline Rich Text Editing**: Click or double-click to edit text directly on the canvas without dialog modals.
- **Visual Alignment Guides & Grid Snapping**: Dynamic horizontal and vertical center guidelines appear as elements align with canvas midpoints, accompanied by optional grid snapping.
- **Z-Index Layer Management**: Bring forward, send backward, duplicate, and delete elements with single-click precision.
- **Keyboard Shortcuts**: Complete productivity hotkeys (`Ctrl+Z`, `Ctrl+Y`, `Ctrl+D`, `Delete`, `Backspace`, `Escape`, arrow key nudging).

### 2. Signature AI Co-Pilot
- **Provider-Independent AI Architecture**: Works out of the box in **Demo Mode** (zero setup or API key required) and seamlessly connects to OpenAI (`gpt-4o-mini`, `gpt-4o`) or Gemini when configured.
- **Context-Aware Scoping**: The assistant understands whether instructions apply to the **Selected Element**, the **Current Slide**, or the **Entire Deck**.
- **Actionable Structured Canvas Edits**: Instead of returning plain chat text, the assistant returns structured operations (`UPDATE_ELEMENT`, `ADD_ELEMENT`, `REDESIGN_SLIDE`, `ADD_SLIDE`, `UPDATE_THEME`) that directly alter the canvas state with instant **Undo** capability.
- **Multi-Slide Deck Generator**: Generate full 3-10 slide presentations from a single prompt, complete with themed layouts, subtitles, bullet points, cards, and speaker notes.
- **Text Refinement & Summarization**: Rewrite copy for simplicity or executive impact, generate supporting bullet points, or summarize slides into takeaway callout boxes.
- **AI Image Generation & Curated Visuals**: Generate slide imagery based on descriptive visual prompts with fallback to curated high-resolution photography.

### 3. Designer Template Gallery
Includes 7 pre-built, realistic presentation decks ready to present or customize:
1. **Business Pitch Deck**: Venture pitch covering Problem, Solution, Traction, Market, and Financials.
2. **Project Proposal**: Technical architecture, deliverables, risk mitigations, and milestones.
3. **Technology Overview**: Cloud-native AI infrastructure, event loops, latency benchmarks.
4. **Educational Presentation**: Human-AI interaction paradigms and design patterns.
5. **Creative Portfolio**: Editorial design showcases, tactile hardware, and typography.
6. **Personal Introduction**: Professional speaker intro, background, and career highlights.
7. **Minimalist Presentation**: High-contrast, whitespace-driven deck prioritizing core principles.

### 4. Enterprise-Grade Exporting
- **PowerPoint (.pptx)**: Generates true native vector PowerPoint presentations via `pptxgenjs`. Text boxes, geometric shapes, colors, and layout positions remain editable in Microsoft PowerPoint, Apple Keynote, and Google Slides.
- **Adobe PDF (.pdf)**: Exports high-resolution 16:9 landscape PDFs via `jspdf`.
- **SlideForge JSON (.slideforge.json)**: Loss-free JSON document format for backup and 1-click re-importing.

### 5. Full-Screen Presentation Mode
- Distraction-free full-screen presentation viewer.
- Keyboard navigation: `Space`, `Enter`, `Right Arrow` (Next); `Left Arrow` (Prev); `Esc` (Exit); `S` (Toggle Speaker Notes).
- Live presentation timer and slide counter.
- Auto-hiding control bar for presentation delivery.

### 6. Dark & Blackish-Violet Design System ("Obsidian Violet")
- **Deep Obsidian Violet Palette**: Designed with an immersive, high-contrast blackish-violet aesthetic inspired by modern creative suites:
  - Deep Canvas Background: `#080612` with subtle violet dot grid
  - UI Surfaces & Sidebars: `#0e0b1f`
  - Cards, Modals & Dropdowns: `#15102d`
  - Subtle Borders: `#2a1f56` with strong accents at `#4c3891`
  - Vibrant Primary Accent: `#a855f7` (violet-500) and `#c084fc` (violet-400)
  - Text: High-contrast crisp off-white `#f5f3ff` and muted violet `#a79fc4`
- **Default Slide Deck Theme**: New presentations and AI-generated slides default to **Obsidian Violet** (`slideBackground: #0d0a1b`), ensuring full visual harmony between the editor shell and the canvas.

### 7. Responsive Architecture (Desktop, Tablet & Mobile)
- **Desktop**: Full 3-panel SaaS workspace (Slide Sidebar, Canvas with Contextual Toolbar, AI Assistant).
- **Tablet**: Narrower slide strip and collapsible AI panel.
- **Mobile**: Touch-friendly bottom navigation bar with slide-out drawers for Slide Thumbnails and the AI Co-Pilot, preserving the 16:9 canvas workspace. Touch targets are 44px or larger.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom styling for canvas grids and scrollbars
- **Icons**: Lucide React
- **State Management**: Zustand (stores canvas state, element selections, undo/redo history stacks, debounced autosave)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Export Engines**: `jspdf`, `pptxgenjs`, `html2canvas`

### Backend
- **Runtime**: Node.js & Express.js
- **Database & Persistence**: Mongoose with MongoDB support, plus an automatic **resilient JSON file repository fallback** (`backend/data/presentations.json`) that ensures zero-downtime operation even if MongoDB is not running locally.
- **File Uploads**: Multer with strict MIME-type validation and 10MB size limits.
- **AI Service Layer**: Modular provider architecture supporting OpenAI, Gemini, and rich offline Demo mode.

---

## 📁 Project Structure

```
slideforge-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/            # Header, Responsive Shell
│   │   │   ├── editor/            # PresentationCanvas, CanvasElement, AlignmentGuides
│   │   │   ├── slides/            # SlideSidebar, SlideThumbnail
│   │   │   ├── toolbar/           # MainToolbar, ContextualToolbar
│   │   │   ├── ai-assistant/      # AiAssistantPanel
│   │   │   ├── dialogs/           # NewSlideModal, TemplateGalleryModal, ExportModal, etc.
│   │   │   └── ui/                # Button, Modal, Dropdown, ColorPicker, Toast
│   │   ├── pages/                 # HomePage, EditorPage, PresentationMode
│   │   ├── hooks/
│   │   ├── store/                 # presentationStore (Zustand)
│   │   ├── services/              # API, Presentation, AI, Upload, Export
│   │   ├── utils/                 # canvasMath, themePresets
│   │   ├── styles/                # index.css (Tailwind base & utilities)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── config/                # db.js, ai.config.js
│   │   ├── controllers/           # presentation, ai, upload, template controllers
│   │   ├── routes/                # REST endpoints
│   │   ├── services/              # aiService, templateService, storageService
│   │   ├── models/                # Presentation schema & persistence repository
│   │   ├── middleware/            # requestLogger, errorHandler
│   │   ├── utils/                 # logger, canvasDefaults
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/                   # Statically served user image uploads
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: If MongoDB is running on `mongodb://localhost:27017/slideforge`, SlideForge automatically connects to it. If MongoDB is not installed or offline, SlideForge automatically activates its resilient persistent file storage in `backend/data/presentations.json`.

---

### 2. Backend Installation & Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd slideforge-ai/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   **Default `.env` configuration:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/slideforge
   FRONTEND_URL=http://localhost:5173
   AI_PROVIDER=demo
   AI_API_KEY=
   AI_MODEL=gpt-4o-mini
   UPLOAD_DIR=uploads
   MAX_UPLOAD_SIZE=10485760
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API will run on **http://localhost:5000**.
   Health check: `http://localhost:5000/api/health`

---

### 3. Frontend Installation & Setup

1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd slideforge-ai/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   **Default `.env` configuration:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open your browser to **http://localhost:5173**.

---

## 🤖 AI Configuration Guide

SlideForge AI includes a built-in provider abstraction layer:

### Demo Mode (Default)
- No API key is required.
- The assistant analyzes user prompts and contextually performs real, structured canvas operations:
  - Converting slides to two-column comparison cards.
  - Adding supporting bullet points to existing text elements.
  - Rewriting text for conciseness, simplicity, or executive tone.
  - Summarizing slides into styled takeaway callout boxes.
  - Generating 3-10 slide structured presentation decks.
  - Inserting high-resolution contextual photography.

### Live OpenAI / Gemini Mode
To connect real LLM providers, edit `backend/.env`:
```env
AI_PROVIDER=openai
AI_API_KEY=sk-...your-openai-api-key...
AI_MODEL=gpt-4o-mini
```
Restart the backend server. The AI assistant status badge in the header will update from `Demo Mode` to `Live AI`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status, database mode, and AI capabilities |
| `GET` | `/api/presentations` | List all presentations (supports `?search=query`) |
| `POST` | `/api/presentations` | Create a new presentation |
| `GET` | `/api/presentations/:id` | Get presentation by ID |
| `PUT` | `/api/presentations/:id` | Update presentation (used by debounced autosave) |
| `PATCH` | `/api/presentations/:id` | Partially update presentation fields |
| `DELETE` | `/api/presentations/:id` | Delete presentation |
| `POST` | `/api/presentations/:id/duplicate` | Clone presentation with fresh IDs and copy title |
| `GET` | `/api/templates` | List all 7 starter templates |
| `GET` | `/api/templates/:id` | Get single starter template |
| `POST` | `/api/templates/:id/use` | Instantiate a presentation from a starter template |
| `POST` | `/api/ai/chat` | Send prompt with context; returns structured actions |
| `POST` | `/api/ai/generate-presentation`| Generate complete multi-slide presentation deck |
| `POST` | `/api/ai/edit-slide` | Target specific slide for redesign |
| `POST` | `/api/ai/generate-image` | Generate or curate image based on prompt |
| `POST` | `/api/uploads` | Upload image file (Multipart form, max 10MB) |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` / `Cmd + Z` | Undo last canvas operation |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo last canvas operation |
| `Ctrl + D` / `Cmd + D` | Duplicate selected element(s) |
| `Delete` / `Backspace` | Delete selected element(s) |
| `Escape` | Clear current element selection / Exit full-screen |
| `Arrow Keys` | Nudge selected element by 2px (or 10px with `Shift`) |
| `Space` / `Right Arrow` | Next slide in presentation mode |
| `Left Arrow` | Previous slide in presentation mode |
| `S` | Toggle speaker notes overlay in presentation mode |

---

## 📄 License
MIT License. Built for personal, creative, and professional presentation editing.
