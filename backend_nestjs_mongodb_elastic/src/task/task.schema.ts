import * as mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  text: String,
  order: {
    type: Number,
    default: 1
  },
  done: {
    type: Boolean,
    default: false
  },
  created_by_id: {
    type: String,
    indexedDB: true
  },
  created_at: {
    type: String,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
});

export { TaskSchema };
