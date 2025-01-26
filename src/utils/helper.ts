import _ from 'lodash';

export const pick = _.pick;

interface IResults {
  docs: any[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page?: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export const formatListResponse = (results: IResults) => {
  const { docs: data, ...paginationOption } = results;
  const pagination = pick(paginationOption, [
    'totalDocs',
    'limit',
    'totalPages',
    'page',
    'pagingCounter',
    'hasPrevPage',
    'hasNextPage',
    'prevPage',
    'nextPage',
  ]);

  return {
    data,
    pagination,
  };
};

type QueryData = {
  page?: string | number;
  limit?: string | number;
  [key: string]: any;
};

export const trimQuery = (queryData: QueryData): QueryData => {
  let { page, limit } = queryData;

  const pageNumber = parseInt(String(page));
  const pageSize = parseInt(String(limit));

  page = !pageNumber || pageNumber < 1 ? 1 : pageNumber;
  limit = !pageSize || pageSize < 1 || pageSize > 30 ? 10 : pageSize;

  const isObject = (object: any): boolean => object !== null && typeof object === 'object';

  function deepTrim(obj: any): any {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (isObject(obj[key])) {
        deepTrim(obj[key]);
      } else {
        obj[key] = obj[key] === 'null' ? null : obj[key];
        obj[key] = obj[key] === 'undefined' ? undefined : obj[key];
      }
    }
    return obj;
  }

  if (queryData.page && queryData.limit) {
    return { ...deepTrim(queryData), page, limit };
  }

  return { ...deepTrim(queryData) };
};
