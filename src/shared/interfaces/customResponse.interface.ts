export interface CustomResponseDto<T> {
  status: boolean;
  message: string;
  content: T;
}
