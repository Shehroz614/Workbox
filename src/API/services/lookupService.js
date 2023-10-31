import { useMutation, useQuery } from "@tanstack/react-query"
import { apiUrls } from "../constants"
import {
  getRequest

} from "../helpers/index"

export const lookupService = {


  getRoleOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getRoleOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getBusinessOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getBusinessOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getMaritalOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getMaritalOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getBloodOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getBloodOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getGenderOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getGenderOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getNationalityOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getNationalityOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  }
  
}
export default lookupService
