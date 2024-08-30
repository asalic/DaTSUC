import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from "@reduxjs/toolkit/query";
//import QueryParamsType from '../model/QueryParamsType';
import ItemPage from '../model/ItemPage';
import QueryParamsType from '../model/QueryParamsType';
import { call, BASE_URL_API, generateError } from "./common-api";
import SingleDataType from "../model/SingleDataType";
import SingleData from '../model/SingleData';
import Util from '../Util';
import DatasetCreationStatus from '../model/DatasetCreationStatus';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'singleDataApi',
  tagTypes: ['Model', "Dataset"],
  endpoints: (build:  EndpointBuilder<any, any, any>) => ({
    getSingleDataPage: build.query<ItemPage<SingleData>, GetSingleDataPageT>({
      queryFn: async ({token, qParams, singleDataType}: GetSingleDataPageT/*, queryApi, extraOptions, baseQuery*/)  => {
        try {
          const dt: any = await call("GET", 
            `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}`, 
            token ? new  Map([["Authorization", "Bearer " + token]]) : null,
            null, "text", qParams);
            if (dt.list) {
              dt.list.forEach((d: any) => d.type = singleDataType);
            }
            return { data: dt as ItemPage<SingleData> };
        } catch(error) { return { error: generateError(error) }; }

      },
    }),
    getSingleData: build.query<SingleData, GetSingleDataT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataT/*, queryApi, extraOptions, baseQuery*/)  => {
        try {
            return { data: {...await call("GET", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", null), type:  singleDataType } as SingleData };
        } catch(error) { return { error: generateError(error) }; }

      },
    }),
    getDatasetCreationStatus: build.query<DatasetCreationStatus, GetDatasetCreationStatusT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token, id}: GetDatasetCreationStatusT/*, queryApi, extraOptions, baseQuery*/)  => {
        try {
            if (!token) {
                return { error: generateError("Invalid token.") } 
            }
            return { data: await call("GET", 
              `${BASE_URL_API}/datasets/${id}/creationStatus`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", null) as DatasetCreationStatus };
        } catch(error) { return { error: generateError(error) }; }

      },
    })
  }),
})


interface GetSingleDataPageT {
  token: string  | null |undefined;
  qParams:  QueryParamsType;
  singleDataType: SingleDataType;
}

interface GetSingleDataT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}

interface GetDatasetCreationStatusT {
  token: string  | null |undefined;
  id:  string;

}

export const { useGetSingleDataPageQuery, 
  useGetSingleDataQuery, 
  useGetDatasetCreationStatusQuery } = api
