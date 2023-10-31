import Swal from "sweetalert2";
import { useSkin } from "@hooks/useSkin";
import { useMemo } from "react";

export const useSweetAlert = () => {
  const { skin } = useSkin();

  const commonConfig = useMemo(() => {
    return {
      allowOutsideClick: false,
      background: skin === "dark" ? "#161D31" : "#F8F8F8",
      heightAuto: false,
    };
  }, [skin]);

  const SweetAlertWithValidation = (obj) => {
    Swal.fire({
      ...commonConfig,
      icon: "error",
      html: `<h4>Please fix following errors</h4>
        <ul class="list-group text-left">${Object.keys(obj).reduce(
          (prev, key) =>
            prev + `<li class="list-group-item py` - `0" >${obj[key]}</li>`,
          ""
        )}</ul>`,
    });
  };

  const SweetAlertWithConfirmation = (warningMessage, successFn) => {
    Swal.fire({
      title: "Are you sure?",
      text: warningMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      ...commonConfig,
    }).then((result) => {
      if (result.isConfirmed) {
        successFn();
      }
    });
  };

  const SweetAlert = (icon, message) => {
    Swal.fire({
      icon: icon,
      text: message,
      confirmButtonText: "Ok",
      ...commonConfig,
    });
  };
  return { SweetAlert, SweetAlertWithConfirmation, SweetAlertWithValidation };
};
