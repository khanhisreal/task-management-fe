import createApiClient from "./apiClient";

export const userApi = createApiClient(import.meta.env.VITE_USER_SERVICE_URL);
export const projectApi = createApiClient(import.meta.env.VITE_PROJECT_SERVICE_URL);
export const taskApi = createApiClient(import.meta.env.VITE_TASK_SERVICE_URL);
export const chatApi = createApiClient(import.meta.env.VITE_CHAT_SERVICE_URL);
