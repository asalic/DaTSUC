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
import SingleDataFactory from '../api/SingleDataFactory';
import Project from '../model/project/Project';
import ProjectConfig from '../model/project/ProjectConfig';
import ProjectList from '../model/project/ProjectList';
import { ProjectFull } from '../model/project/ProjectFull';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'singleDataApi',
  refetchOnMountOrArgChange: false,
  tagTypes: ["Model", "Dataset", "ModelAcl", "DatasetAcl", "Project", "ProjectList", "ProjectConfig"],
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
                  dt.list.forEach((d: any) => {
                    d["typeApi"] = d.type;
                    d.type = singleDataType;
                    
                });
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
            const data = SingleDataFactory.fromObj(await call("GET", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
                token ? new  Map([["Authorization", "Bearer " + token]]) : null,
                null, "text", null), singleDataType);
              return { data };
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
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              await call("DELETE", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                headers,
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
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              await call("PUT", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/acl/${username}`, 
                headers,
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
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              return { data: await call("POST", 
                `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}/checkIntegrity`, 
                headers,
                null, "text", null) };
          } catch(error) { return { error: generateError(error) }; }

        },
        invalidatesTags: ["Model", "Dataset"],
    }),
    deleteSingleDataCreating: build.mutation<DeletedSingleData, DeleteSingleDataCreatingT>({
      queryFn: async ({token, id, singleDataType, name }: DeleteSingleDataCreatingT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
            await call("DELETE", 
              `${BASE_URL_API}/${Util.singleDataPath(singleDataType)}/${id}`, 
              headers,
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
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
              }
              return { data: await call("GET", 
                `${BASE_URL_API}/upgradableDatasets`, headers,
                null, "text", null) as UpgradableDataset[] };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),
    
    getDatasetCreationStatus: build.query<DatasetCreationStatus, GetDatasetCreationStatusT>({
      keepUnusedDataFor: 0,
      queryFn: async ({token, id}: GetDatasetCreationStatusT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                  return { error: generateError("Invalid token.") } 
            }
            return { data: await call("GET", 
            `${BASE_URL_API}/datasets/${id}/creationStatus`, headers,
            null, "text", null) as DatasetCreationStatus };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),

    getLicenses: build.query<Array<License>, GetLicensesT>({
      queryFn: async ({token}: GetLicensesT)  => 
        {
          try {
            const headers = new Map();
            if (token) {
                headers.set("Authorization", "Bearer " + token);
            } else {
                return { error: generateError("Invalid token.") } 
            }
              return { data: await call("GET", 
                `${BASE_URL_API}/licenses`, headers,
                null, "text", null) as Array<License> };
          } catch(error) { return { error: generateError(error) }; }

        },
    }),


    putProject: build.mutation<boolean, PutProjectT>({
        queryFn: async ({projectFull, token}: PutProjectT)  => 
          {
            try {
                const headers = new Map([["Content-Type",  "application/json"]]);
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                } else {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PUT", 
                  `${BASE_URL_API}/projects/${projectFull.code}`, headers,
                  JSON.stringify(projectFull), "text", null);
                  return {data: true};
            } catch(error) { return { error: generateError(error) }; }
  
          },
          invalidatesTags: ["ProjectList"],
      }),

    putProjectConfig: build.mutation<boolean, PutProjectConfigT>({
        queryFn: async ({projectConfig, token,  code}: PutProjectConfigT)  => 
            {
            try {
                const headers = new Map([["Content-Type",  "application/json"]]);
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                } else {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PUT", 
                    `${BASE_URL_API}/projects/${code}/config`, headers,
                    JSON.stringify(projectConfig), "text", null);
                    return {data: true};
            } catch(error) { return { error: generateError(error) }; }

            },
            invalidatesTags: ["ProjectConfig"],
        }),

    getProjects: build.query<ProjectList | Array<string>, GetProjectsT>({
        queryFn: async ({token, purpose}: GetProjectsT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects?purpose=${purpose}`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["ProjectList"],
      }),

      getProject: build.query<Project, GetProjectT>({
        queryFn: async ({token, code}: GetProjectT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects/${code}`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["Project"],
      }),

      getProjectConfig: build.query<ProjectConfig, GetProjectConfigT>({
        queryFn: async ({token, code}: GetProjectConfigT)  => 
          {
            try {
                let headers = new Map();
                if (token) {
                    headers.set("Authorization", "Bearer " + token);
                }
                return { data: await call("GET", 
                  `${BASE_URL_API}/projects/${code}/config`, headers,
                  null, "text", null) };
            } catch(error) { return { error: generateError(error) }; }
  
          },
          providesTags: ["ProjectConfig"],
      }),

    patchProject: build.mutation<boolean, PatchProjectT>({
        queryFn: async ({ token, code, property, value }: PatchProjectT)  => 
          {
            try {
                if (!token) {
                    return { error: generateError("Invalid token.") } 
                }
                await call("PATCH", 
                  `${BASE_URL_API}/projects/${code}`, 
                  token ? new  Map([["Authorization", "Bearer " + token], ["Content-Type", "application/json"]]) : null,
                  JSON.stringify({ property, value}), "text", null)
                return { data: true };
            } catch(error) { return { error: generateError(error) }; }
  
          },
        invalidatesTags: ["Project", "ProjectList"],
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
  value: string | boolean | null;
  singleDataType: SingleDataType;
}

interface GetUpgradableDatasetsT {
  token: string | null | undefined;
}

interface GetLicensesT {
  token: string | null | undefined;
}

interface PutProjectT {
    projectFull: ProjectFull;
    token: string;
}

interface PutProjectConfigT {
    projectConfig: ProjectConfig;
    token: string;
    code: string;
}

interface GetProjectsT {
    token: string | null | undefined;
    purpose: string;
}

interface GetProjectT {
    token: string | null | undefined;
    code: string;
}

interface GetProjectConfigT {
    token: string | null | undefined;
    code: string;
}

interface PatchProjectT {
    token: string | null | undefined;
    code: string;
    property: string;
    value: string | boolean | null;
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
  useGetLicensesQuery,
  usePutProjectMutation,
  usePutProjectConfigMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
    useGetProjectConfigQuery,
    usePatchProjectMutation} = api
