export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  DELETE = 'DELETE',
}

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  status: Status;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
