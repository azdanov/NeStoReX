export interface ErrorResponse {
  status: number;
  data: Data;
}

export interface Data {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors?: Record<string, string[]>;
}
