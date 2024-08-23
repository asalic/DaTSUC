import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import Dataset from "../model/Dataset";
//import QueryParamsType from '../model/QueryParamsType';
import DataManager from '../api/DataManager';
import ItemPage from '../model/ItemPage';

const dataManager = new DataManager();


export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'datasetApi',
  endpoints: (build) => ({
    getDatasets: build.query<ItemPage<Dataset>, any>({
      queryFn: async ({token, qParams}, 
            queryApi, extraOptions, baseQuery)  => {
        try {
            const xhr = await dataManager.getDatasets(token, qParams);
            const data = JSON.parse(xhr.response);
            return {data};
        } catch(error) {
            let errMsg = "none";
            if (isFetchBaseQueryError(error)) {
                // you can access all properties of `FetchBaseQueryError` here
                errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
              } else if (isErrorWithMessage(error)) {
                errMsg = error.message
              } else {
                errMsg = JSON.stringify(error);
              }
              return { error: { status: 0, data: errMsg } };
        }

      },
    }),
  }),
})

export const { useGetDatasetsQuery } = api
