import { UserSearchBodyDTO } from './user_search_body.interface';
export interface UserSearchResultDTO {
  hits: {
    total: number;
    hits: Array<{
      _source: UserSearchBodyDTO;
    }>;
  };
}
