export interface CustomResponseDto<T> {
  status: number;
  message: string;
  content: T;
}
