import axios from "axios"
import { customDispatch, customNavigate, customToken } from "../../utility/Utils"
import { handleLogout } from "../../redux/authentication"

export const axiosInstance = axios.create()

const APIBASEURL = import.meta.env.VITE_API_BASE_URL

//Adding A Request Interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config?.url?.includes(APIBASEURL)) return config
    const token = customToken.token

    if (token != null && token !== "") {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers["X-API-KEY"] = import.meta.env.VITE_API_SECRET_KEY
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)
//Adding A Response Interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // //
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    if (error.code == "ERR_NETWORK") {
      localStorage.setItem('timeoutPage', window.location.href)
      localStorage.setItem('swalMsg', "Network Error! Please login again.")
      customDispatch.dispatch(handleLogout())
      customNavigate.navigate('/')
    }
    try {
      if (error.response.status == 401) {
        localStorage.setItem('timeoutPage', window.location.href)
        localStorage.setItem('swalMsg', "Session Expired! Please login again.")
        customDispatch.dispatch(handleLogout())
        customNavigate.navigate('/')
      }
    } catch (ex) {
      //Logout("apid");
      //   Common.LogError(ex, "Api Call in api.js file", "Intercepter");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export async function getRequest(url) {
  return await axiosInstance.get(APIBASEURL + url)
}

export async function getRequestWithTypeBlob(url) {
  return await axiosInstance.get(APIBASEURL + url, {
    responseType: "blob"
  })
}
export async function getRequestByStringQuery(url, stringQuery) {
  return await axiosInstance.get(APIBASEURL + url + stringQuery)
}
export async function postRequest(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload)
}

export async function postRequestWithFile(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*"
    }
  })
}

export async function postRequestWithTypeBlob(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    responseType: "blob"
  })
}

export async function patchRequest(url, payload) {
  return await axiosInstance.patch(APIBASEURL + url, payload)
}

export async function putRequest(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload)
}

export async function putRequestWithFile(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*"
    }
  })
}

export async function deleteRequest(url) {
  return await axiosInstance.delete(APIBASEURL + url)
}
