import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EndpointBuilder } from "@reduxjs/toolkit/query";
import Dataset from "../model/Dataset";
//import QueryParamsType from '../model/QueryParamsType';
import ItemPage from '../model/ItemPage';
import QueryParamsType from '../model/QueryParamsType';
import { call, BASE_URL_API } from "./common-api";
import SingleDataType from "../model/SingleDataType";
import Model from '../model/Model';
import SingleData from '../model/SingleData';
import Util from '../Util';


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

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'singleDataApi',
  endpoints: (build:  EndpointBuilder<any, any, any>) => ({
    getSingleDataPage: build.query<ItemPage<SingleData>, GetSingleDataPageT>({
      queryFn: async ({token, qParams, singleDataType}: GetSingleDataPageT/*, queryApi, extraOptions, baseQuery*/)  => {
        try {
            return { data: await call<ItemPage<SingleData>>("GET", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", qParams)};
        } catch(error) { return { error: error }; }

      },
    }),
    getSingleData: build.query<SingleData, GetSingleDataT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataT/*, queryApi, extraOptions, baseQuery*/)  => {
        try {
            return { data: await call<Dataset | Model>("GET", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", null)};
        } catch(error) { return { error: error }; }

      },
    }),
  }),
})



export const { useGetSingleDataPageQuery } = api
