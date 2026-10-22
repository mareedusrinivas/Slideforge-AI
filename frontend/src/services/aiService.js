import api from './api';

export const aiService = {
  async getStatus() {
    const res = await api.get('/ai/status');
    return res.data.data;
  },

  async chat(message, context = {}, scope = 'current_slide') {
    const res = await api.post('/ai/chat', { message, context, scope });
    return res.data.data;
  },

  async generatePresentation(params) {
    const res = await api.post('/ai/generate-presentation', params);
    return res.data.data;
  },

  async editSlide(slide, instruction, theme) {
    const res = await api.post('/ai/edit-slide', { slide, instruction, theme });
    return res.data.data;
  },

  async generateImage(prompt, style = 'modern') {
    const res = await api.post('/ai/generate-image', { prompt, style });
    return res.data.data;
  }
};
