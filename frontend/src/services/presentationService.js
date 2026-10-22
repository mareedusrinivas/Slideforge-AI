import api from './api';

export const presentationService = {
  async getAll(search = '') {
    const params = search ? { search } : {};
    const res = await api.get('/presentations', { params });
    return res.data.data;
  },

  async getById(id) {
    const res = await api.get(`/presentations/${id}`);
    return res.data.data;
  },

  async create(data = {}) {
    const res = await api.post('/presentations', data);
    return res.data.data;
  },

  async update(id, updates) {
    const res = await api.put(`/presentations/${id}`, updates);
    return res.data.data;
  },

  async patch(id, partialUpdates) {
    const res = await api.patch(`/presentations/${id}`, partialUpdates);
    return res.data.data;
  },

  async delete(id) {
    const res = await api.delete(`/presentations/${id}`);
    return res.data.data;
  },

  async duplicate(id) {
    const res = await api.post(`/presentations/${id}/duplicate`);
    return res.data.data;
  },

  async getTemplates() {
    const res = await api.get('/templates');
    return res.data.data;
  },

  async useTemplate(templateId, title) {
    const res = await api.post(`/templates/${templateId}/use`, { title });
    return res.data.data;
  }
};
