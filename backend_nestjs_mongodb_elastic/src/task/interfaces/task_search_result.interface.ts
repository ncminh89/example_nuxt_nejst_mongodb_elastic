import { TaskSearchBodyInterface } from "./task_search_body.interface";

export interface TaskSearchResultInterface {
  hits: {
    total: number;
    hits: Array<{
      _source: TaskSearchBodyInterface;
    }>;
  };
}
