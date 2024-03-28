import { Status } from './statusTask.enum';

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  status: Status;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
