import { Document } from 'mongoose';

export interface TaskInterface extends Document {
  text: string,
  order: number,
  created_by_id: string,
  created_at: string,
  updated_at: string,
}
