export enum EnumMessageStatus {
  SUCCESS_200 = 'Success',
  CREATED_201 = 'Created',
  UPDATED = 'Updated',
  DELETED = 'Deleted',
  ERROR = 'Error',
  BAD_REQUEST_400 = 'Bad Request',
  NOT_FOUND_404 = 'Not Found',
  UNAUTHORIZED_401 = 'Unauthorized',
  FORBIDDEN_403 = 'Forbidden',
  INTERNET_SERVER_ERROR_500 = 'Internet Server Error',
}

export enum EnumHeaderKey {
  API_KEY = 'x-api-key',
  TOKEN = 'x-token',
  AUTHORIZATION = 'authorization',
  CLIEND_ID = 'x-client-id',
  REFRESH_TOKEN = 'x-rtoken-id',
}

export enum EnumPermission {
  ALL = 'ALL',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EnumRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
