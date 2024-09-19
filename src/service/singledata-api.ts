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
import License from '../model/License';
import UpgradableDataset from '../model/UpgradableDataset';
import CheckIntegrity from '../model/CheckIntegrity';
import AclUser from '../model/AclUser';
import DeletedSingleData from '../model/DeletedSingleData';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'singleDataApi',
  refetchOnMountOrArgChange: true,
  tagTypes: ["Model", "Dataset", "ModelAcl", "DatasetAcl"],
  endpoints: (build:  EndpointBuilder<any, any, any>) => ({
    getSingleDataPage: build.query<ItemPage<SingleData>, GetSingleDataPageT>({
      queryFn: async ({token, qParams, singleDataType}: GetSingleDataPageT
        /*, queryApi, extraOptions, baseQuery*/)  => 
        {
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
        providesTags: ["Model", "Dataset"],
        // (result: ItemPage<SingleData> |undefined, error, arg) => {
        //   const type: string = Util.singleDataClass(arg.singleDataType).constructor.name;
        //   return result && result.list
        //     ? [...result.list.map(({ id }) => ({ type, id })), type]
        //     : [type];
        // }
    }),
    getSingleData: build.query<SingleData, GetSingleDataT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataT)  => 
        {
          try {
              return { data: {...await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null), type:  singleDataType } as SingleData };
          } catch(error) { return { error: generateError(error) }; }

        },
      providesTags: ["Model", "Dataset"],
    }),
    patchSingleData: build.mutation<boolean, PatchSingleDataT>({
      queryFn: async ({ token, id, property, value, singleDataType }: PatchSingleDataT)  => 
        {
          try {
              if (!token) {
                  return { error: generateError("Invalid token.") } 
              }
              console.log("here");
              await call("PATCH", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
                token ? new  Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                JSON.stringify({ property, value}), "text", null)
              return { data: true };
          } catch(error) { return { error: generateError(error) }; }

        },
      invalidatesTags: ["Model", "Dataset"],
    }),
    getSingleDataAcl: build.query<AclUser[], GetSingleDataAclT>({
      queryFn: async ({token, id, singleDataType}: GetSingleDataAclT)  => 
        {
          try {
            const data: AclUser[] =  await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) as AclUser[];
              return { data};
          } catch(error) { return { error: generateError(error) }; }

        },
      providesTags: ["ModelAcl", "DatasetAcl"],
    }),
    deleteSingleDataAcl: build.mutation<null, DeleteSingleDataAclT>({
      queryFn: async ({token, id, singleDataType, username}: DeleteSingleDataAclT)  => 
        {
          try {
              await call("DELETE", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null);
              return { data: null };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["ModelAcl", "DatasetAcl"],
    }),
    putSingleDataAcl: build.mutation<boolean, PutSingleDataAclT>({
      queryFn: async ({token, id, singleDataType, username}: DeleteSingleDataAclT)  => 
        {
          try {
              await call("PUT", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null);
              return { data: true };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["ModelAcl", "DatasetAcl"],
    }),
    postSingleDataCheckIntegrity: build.mutation<CheckIntegrity, PostSingleDataCheckIntegrityT>({
      queryFn: async ({token, id, singleDataType }: PostSingleDataCheckIntegrityT)  => 
        {
          try {
              return { data: await call("POST", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/checkIntegrity`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["Model", "Dataset"],
    }),
    deleteSingleDataCreating: build.mutation<DeletedSingleData, DeleteSingleDataCreatingT>({
      queryFn: async ({token, id, singleDataType, name }: DeleteSingleDataCreatingT)  => 
        {
          try {
            await call("DELETE", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
              token ? new  Map([["Authorization", "Bearer " + token]]) : null,
              null, "text", null)
              return { data: { name, id, type: singleDataType} as DeletedSingleData };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["Model", "Dataset"],
    }),



    getUpgradableDatasets: build.query<UpgradableDataset[], GetUpgradableDatasetsT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token}: GetDatasetCreationStatusT)  => 
        {
          try {
              if (!token) {
                  return { error: generateError("Invalid token.") } 
              }
              return { data: await call("GET", 
                `${BASE_URL_API}/upgradableDatasets`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null) as UpgradableDataset[] };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),
    
    getDatasetCreationStatus: build.query<DatasetCreationStatus, GetDatasetCreationStatusT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token, id}: GetDatasetCreationStatusT)  => 
        {
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
    }),

    getLicenses: build.query<Array<License>, GetLicensesT>({
      queryFn: async ({token}: GetLicensesT)  => 
        {
          try {
            if (!token) {
                return { error: generateError("Invalid token.") } 
            }
              return { data: await call("GET", 
                `${BASE_URL_API}/licenses`, new  Map([["Authorization", "Bearer " + token]]),
                null, "text", null) as Array<License> };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),
    
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

interface GetSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
}

interface DeleteSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  username: string;
}

interface PutSingleDataAclT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  username: string;
}

interface PostSingleDataCheckIntegrityT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;

}
interface DeleteSingleDataCreatingT {
  token: string  | null |undefined;
  id:  string;
  singleDataType: SingleDataType;
  name: string;
}

interface GetDatasetCreationStatusT {
  token: string  | null |undefined;
  id:  string;

}

interface PatchSingleDataT {
  token: string | null | undefined;
  id: string;
  property: string;
  value: string | null;
  singleDataType: SingleDataType;
}

interface GetUpgradableDatasetsT {
  token: string | null | undefined;
}

interface GetLicensesT {
  token: string | null | undefined;
}


export const { 
  useGetSingleDataPageQuery, 
  useGetSingleDataQuery, 
  useGetSingleDataAclQuery,
  useDeleteSingleDataAclMutation,
  usePutSingleDataAclMutation,
  usePostSingleDataCheckIntegrityMutation,
  useDeleteSingleDataCreatingMutation,
  usePatchSingleDataMutation,
  useGetDatasetCreationStatusQuery,
  useGetUpgradableDatasetsQuery,
  useGetLicensesQuery } = api
