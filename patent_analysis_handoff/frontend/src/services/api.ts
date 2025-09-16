
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  getProjectAnalyses: async (id: string) => {
    const response = await api.get(`/projects/${id}/analyses`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  searchPatents: async (searchData: any) => {
    const response = await api.post('/search/patents', searchData);
    return response.data;
  },

  semanticSearch: async (searchData: any) => {
    const response = await api.post('/search/semantic', searchData);
    return response.data;
  },

  getSearchSuggestions: async (query: string) => {
    const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  advancedSearch: async (searchData: any) => {
    const response = await api.post('/search/advanced', searchData);
    return response.data;
  },
};

// Analysis API
export const analysisAPI = {
  createAnalysis: async (analysisData: any) => {
    const response = await api.post('/analyses', analysisData);
    return response.data;
  },

  getAnalysis: async (id: string) => {
    const response = await api.get(`/analyses/${id}`);
    return response.data;
  },

  updateAnalysis: async (id: string, analysisData: any) => {
    const response = await api.put(`/analyses/${id}`, analysisData);
    return response.data;
  },

  deleteAnalysis: async (id: string) => {
    const response = await api.delete(`/analyses/${id}`);
    return response.data;
  },
};

// Batch API
export const batchAPI = {
  submitBatchJob: async (batchData: any) => {
    const response = await api.post('/batch', batchData);
    return response.data;
  },

  getBatchJob: async (id: string) => {
    const response = await api.get(`/batch/${id}`);
    return response.data;
  },

  getBatchJobs: async () => {
    const response = await api.get('/batch');
    return response.data;
  },

  cancelBatchJob: async (id: string) => {
    const response = await api.delete(`/batch/${id}`);
    return response.data;
  },
};

// Agents API
export const agentsAPI = {
  getAgents: async () => {
    const response = await api.get('/agents');
    return response.data;
  },

  runAgentAnalysis: async (agentData: any) => {
    const response = await api.post('/agents/analyze', agentData);
    return response.data;
  },

  getAgentStatus: async (id: string) => {
    const response = await api.get(`/agents/${id}/status`);
    return response.data;
  },

  coordinateAgents: async (coordinationData: any) => {
    const response = await api.post('/agents/coordinate', coordinationData);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async (personaType: string) => {
    const response = await api.get(`/dashboard/${personaType}`);
    return response.data;
  },

  getInventorDashboard: async () => {
    const response = await api.get('/dashboard/inventor');
    return response.data;
  },

  getCorporateRDDashboard: async () => {
    const response = await api.get('/dashboard/corporate-rd');
    return response.data;
  },

  getPatentAttorneyDashboard: async () => {
    const response = await api.get('/dashboard/patent-attorney');
    return response.data;
  },

  getBusinessStrategistDashboard: async () => {
    const response = await api.get('/dashboard/business-strategist');
    return response.data;
  },
};

export default api;
