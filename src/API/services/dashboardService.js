import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import {
  getRequest,
  putRequest,
  postRequestWithFile,
  deleteRequestByUrl,
  putRequestWithFile,
  postRequest,
  patchRequest,
} from "../helpers/index";

export const DashboardService = {
  getDashboardStats: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getDashboardStats);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getTableRecords: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getTableRecords);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  updatePriority: (options) => {
    return useMutation((payload) => {
      return patchRequest(apiUrls.updatePriority(payload?.deviceId, payload?.priorityId), payload);
    }, options)
  },
  getDashboardAccessPoints: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getDashboardAccessPoints);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getDashboardCubes: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getDashboardCubes);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getDashboardMeters: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getDashboardMeters);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getDashboardSiteLocationsByID: (options) => {
    return useMutation((id) => {
      return getRequest(
        apiUrls.getDashboardSiteLocationsByID(id)
      );
    }, options);
  },
};
