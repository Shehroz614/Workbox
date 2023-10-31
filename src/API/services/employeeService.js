import { useMutation, useQuery } from "@tanstack/react-query"
import { apiUrls } from "../constants"
import {
  getRequest,
  putRequest,
  postRequestWithFile,
  deleteRequest,
  putRequestWithFile,
  postRequest
} from "../helpers/index"

export const employeeService = {
  getUsers: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getUserListing)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  getOneEmployee: (key, id, options) => {
    return useQuery(
      [key, id],
      () => {
        return getRequest(apiUrls.getOneUser(id))
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  addEmployee: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.addEmployee, payload)
    }, options)
  },
  updateEmployee: (options) => {
    return useMutation((payload) => {
      return putRequest(apiUrls.updateUser(payload?.id), payload)
    }, options)
  },
  deleteEmployee: (options) => {
    return useMutation((payload) => {
      return deleteRequest(apiUrls.deleteUser(payload?.id))
    }, options)
  },
  changeStatus: (options) => {
    return useMutation((payload) => {
      return postRequest(
        apiUrls.changeUserStatus(payload?.id, payload?.status)
      )
    }, options)
  },
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
  getSitesOptions: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getSitesOptions)
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options
      }
    )
  },
  resendEmail: (options) => {
    return useMutation((payload) => {
      return putRequest(apiUrls.resendEmail, payload?.id)
    }, options)
  }
}
export default employeeService
