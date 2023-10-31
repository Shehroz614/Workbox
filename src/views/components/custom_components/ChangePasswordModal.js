import { CloseButton, Form, Modal, ModalBody, ModalHeader } from "reactstrap"
import * as Yup from "yup";
import FormikProvider from "@src/context/formik";
import CustomButton from "@src/components/CustomButton";
import CustomInput from "@src/components/CustomInput";
import { useFormik } from "formik";
import { authService } from "../services/authService";
import { useSweetAlert } from "./SweetAlert";
import { Key } from "react-feather";

const ChangePasswordModal = ({open, setOpen, userId}) => {
    //#region formik
    const { SweetAlert, SweetAlertWithValidation } = useSweetAlert()

    const schema = Yup.object().shape({
        currentPassword: Yup.string().min(6, "Minimum 6 characters are required")
          .trim()
          .required("Current Password is required"),
        newPassword: Yup.string().min(6, "Minimum 6 characters are required")
          .trim()
          .required("New Password is required"),
        confirmNewPassword: Yup.string()
            .trim()
            .required("Confirm New Password is required")
            .oneOf([Yup.ref("newPassword"), null], "New Passwords must match"),
      });
    
      const formik = useFormik({
        initialValues: {
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
          const payload = {
            userId: userId,
            currentPassword: values?.currentPassword,
            newPassword: values?.newPassword,
          };

          changePassword(payload);
        },
      });
    //#endregion

    //#region Event Handlers
    // API call for resetting password
    const { mutate: changePassword, isLoading: isSaving } = authService.changePassword({
        onSuccess: async (response) => {
          if (response?.data?.success == true) {
            SweetAlert("success", response?.data?.message);
            setOpen(false)
            formik.resetForm()
          } else {
            const errs = response.data.result;
  
            if (errs && Object.keys(errs)?.length > 0) {
              SweetAlertWithValidation(errs);
              return;
            } else {
              const errMsg = response.data.message;
              SweetAlert("error", errMsg);
            }
          }
        },
        onError: (error) => {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        },
        networkMode: "always",
      });
      //#endregion

    const handleKeyPress = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            formik.handleSubmit();
        }
    };

    return (
        <Modal isOpen={open} centered>
            <ModalHeader toggle={() => {
                setOpen(false)
                formik.resetForm()
              }}>
                <div className="page-title text-primary">
                  <Key size={28}/>
                  <h4 className="text mt-50">Change Password</h4>
                </div>
            </ModalHeader>
            <ModalBody className="d-flex justify-content-center">
                <FormikProvider
                    formik={formik}
                >
                    <Form className='auth-change-password-form my-1 mx-2 w-100' onSubmit={e => e.preventDefault()}>
                        <div className='mb-1'>
                            <CustomInput
                                type="password"
                                name="currentPassword"
                                label="Current Password"
                                isInputGroup={true}
                                placeholder="****"
                                visible={false}
                                disabled={isSaving}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className='mb-1'>
                            <CustomInput
                                type="password"
                                name="newPassword"
                                label="New Password"
                                isInputGroup={true}
                                placeholder="****"
                                visible={false}
                                disabled={isSaving}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className='mb-2'>
                            <CustomInput
                                type="password"
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                isInputGroup={true}
                                placeholder="****"
                                visible={false}
                                disabled={isSaving}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <CustomButton
                            block
                            type="button"
                            color="primary"
                            onClick={formik.handleSubmit}
                            disabled={isSaving}
                            loading={isSaving}
                        >
                            Change Password
                        </CustomButton>
                    </Form>
                </FormikProvider>
            </ModalBody>
        </Modal>
    )
}

export default ChangePasswordModal