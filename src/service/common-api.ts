import QueryParamsType from "../model/QueryParamsType";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import Config from "../config.json";
import Util from "../Util";


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
  
  export function generateError(errorUnk: any): FetchBaseQueryError |  Error {
    let error: any = null;
    if (isFetchBaseQueryError(errorUnk)) {
        // you can access all properties of `FetchBaseQueryError` here
        //errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
        error = errorUnk;
    } else if (isErrorWithMessage(errorUnk)) {
      error = new Error(errorUnk.message);
    } else {
      error = new Error(JSON.stringify(errorUnk));
    }
      return error;
  
  }
  

export async function call(method: string, path: string, 
    headers: Map<string, string> | null,   payload: any,   
    responseType: XMLHttpRequestResponseType, 
    queryParams: QueryParamsType | null): Promise<any> {
    try {
      const request = await _call(method, path, headers, payload,  responseType, queryParams);
        // Process the response
        if (request.status >= 200 && request.status < 300) {
            // If successful
            if (request.response !== undefined && request.response !== null) {
              if (Util.isJson(request.response)) {
                return JSON.parse(request.response);
              } else {
                return request.responseText;
              }
            } else {
              return null;
            }
        } else { 
          let data = request.responseText;
          if (Util.isJson(data)) {
            const r = JSON.parse(data);
            if ("message" in r)   {
              data = r.message;
            }
          } else {
            data = request.responseText;
          }
          throw { data, status: request.status} as FetchBaseQueryError;
        }
      
    } catch(error) { throw generateError(error); }
  }
  
function _call(method: string, path: string, 
    headers: Map<string, string> | null, payload: any,   
      responseType: XMLHttpRequestResponseType, 
      queryParams: QueryParamsType | null): Promise<XMLHttpRequest> {
  
    let request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
          // Setup our listener to process compeleted requests
          request.onreadystatechange = function () {
              //console.log(path);
              // Only run if the request is complete
              if (request.readyState !== 4)
                  return;
  
              resolve(request);
  
              // // Process the response
              // if (request.status >= 200 && request.status < 300) {
              //     // If successful
              //     return resolve(JSON.parse(request.response) as T);
              // } else {
              //     // If failed
              //     reject({data: request.responseText, status: request.status});
              // }
  
          };
          if (queryParams !== null) {
            const entr = Object.entries(queryParams);
            //let size = entr.length;
            for (const [k,v] of entr) {
              if (v === undefined || v === null) {
                delete queryParams[k];
                //--size;
              }
            }
            if  (entr.length !== 0)  {
              path += "?" + Object.entries(queryParams)
                .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v ?? ""))
                .join("&");
            }
          }
  
          request.onerror = (err) => reject(err);
          request.open(method, path, true);
          request.responseType = responseType;
  
  
          if (headers) {
            for (const [k, v] of headers)
                request.setRequestHeader(k, v);
          }
          //request.setRequestHeader("Authorization", "Bearer " + token);
          request.send(payload);
  
    });
  }
  
  export const BASE_URL_API: string = Config.datasetService;