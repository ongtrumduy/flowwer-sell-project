const BASE_NAME = '';

export const AppRoutes = {
  BASE: () => `${BASE_NAME}`,
  HOME: () => `${BASE_NAME}/`,
  LOGIN: () => `${BASE_NAME}/login`,
  SIGN_UP: () => `${BASE_NAME}/sign-up`,
  PROFILE: () => `${BASE_NAME}/profile`,
  ADMIN_DASHBOARD: () => `${BASE_NAME}/admin/dashboard`,

  PAGE_NOT_FOUND: () => `${BASE_NAME}/not-found`,
  PAGE_UNAUTHORIZED: () => `${BASE_NAME}/unauthorized`,
  PAGE_SERVER_ERROR: () => `${BASE_NAME}/server-error`,
};
