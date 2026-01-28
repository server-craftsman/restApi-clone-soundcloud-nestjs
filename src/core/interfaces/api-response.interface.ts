export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  err?: string | Record<string, any>;
  message?: string;
  statusCode?: number;
}
