import { TaskSearchResultInterface } from './interfaces/task_search_result.interface';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TaskSearchBodyInterface } from './interfaces/task_search_body.interface';
import { TaskInterface } from './interfaces/task.interface';

@Injectable()
export class TaskSearchService {
  index = 'tasks';

  constructor(private readonly elasticsearchService: ElasticsearchService) { }

  async search(text: string) {
    const { body } =
      await this.elasticsearchService.search<TaskSearchResultInterface>({
        index: this.index,
        body: {
          query: {
            multi_match: {
              query: text,
              fields: ['name', 'taskname', 'email'],
              type: 'phrase_prefix',
            },
          },
        },
      });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async create(task: TaskInterface) {
    return this.elasticsearchService.index<
      TaskSearchResultInterface,
      TaskSearchBodyInterface
    >({
      index: this.index,
      body: {
        ...task
      },
    });
  }

  async update(task: TaskInterface) {
    const newBody: TaskSearchBodyInterface = {
      ...task
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: task.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  async delete(task: TaskInterface) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: task.id,
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
