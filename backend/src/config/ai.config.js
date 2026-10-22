module.exports = {
  get provider() {
    return process.env.AI_PROVIDER || (this.apiKey ? 'gemini' : 'demo');
  },
  get apiKey() {
    return (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '').trim();
  },
  get model() {
    return process.env.AI_MODEL || 'gemini-3.8-flash';
  },
  get imageProvider() {
    return process.env.IMAGE_PROVIDER || 'demo';
  },
  get isConfigured() {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }
};
