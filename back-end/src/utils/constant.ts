import { EnumPermission, EnumRole } from './type';

export const DEFAULT_ROLE = [EnumRole.USER];
export const DEFAULT_PERMISSION = [EnumPermission.ALL];

export const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN || '1m';
export const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
