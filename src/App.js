import React, { Suspense } from "react";
import Router from "./router/Router";
import { authService } from "@src/API/services/authService";
import { useDispatch } from "react-redux";
import { handleLogin, handleLogout } from "./redux/authentication";
import SpinnerComponent from "./@core/components/spinner/Fallback-spinner";
import { useEffect } from "react";
import { useSweetAlert } from "./views/components/custom_components/SweetAlert";
import { customDispatch, customNavigate, customToken } from "./utility/Utils";
import { useNavigate } from "react-router";

const App = () => {
  //#region States
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { SweetAlert, SweetAlertWithValidation } = useSweetAlert()
  //#endregion States

  customDispatch.dispatch = dispatch
  customNavigate.navigate = useNavigate()

  //#region Event Handlers
  const { data: meData, isFetching: isLoading } = authService.me(["get-me"], {
    onSuccess: (data) => {
      if (data?.data?.success) {
        const { result } = data?.data;

        const payload = {
          user: result,
          login: true,
          role: result?.role,
        };
        // dispatch(handleLogin(payload));
      } else {
        const errs = data?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", data.data.message);
          }
      }
    },
    onError: (error) => {
      const errs = error?.response?.data?.result?.referenceErrorCode ? null : error?.response?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", (error?.response?.data?.message || error?.response?.data?.title) || error?.message);
          }
    },
    refetchOnWindowFocus: false,
    retry: false,
    networkMode: "always",
    enabled: false //!!token,
  });
  //#endregion Event Handlers

  //#region UseEffects
  useEffect(() => {
    if(!token)
    {
      dispatch(handleLogout)
    }
    customToken.token = token
  }, [token]);
  //#endregion

  return (
    <Suspense fallback={null}>
      {isLoading ? <SpinnerComponent /> : <Router />}
    </Suspense>
  );
};

export default App;
