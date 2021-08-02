import { UserDTO } from './interfaces/user.interface';
import { UserSearchBodyDTO } from './interfaces/user_search_body.interface';
import { UserSearchResultDTO } from './interfaces/user_search_result.interface';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UserSearchService {
  index = 'users';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(text: string) {
    const { body } =
      await this.elasticsearchService.search<UserSearchResultDTO>({
        index: this.index,
        body: {
          query: {
            multi_match: {
              query: text,
              fields: ['name', 'username', 'email'],
              type: 'phrase_prefix',
            },
          },
        },
      });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async create(user: UserDTO) {
    return this.elasticsearchService.index<
      UserSearchResultDTO,
      UserSearchBodyDTO
    >({
      index: this.index,
      body: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  }

  async update(user: UserDTO) {
    const newBody: UserSearchBodyDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: user.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  async delete(user: UserDTO) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: user.id,
          },
        },
      },
    });
  }

  async deleteAll() {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }
}
