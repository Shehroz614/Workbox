import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from "reactstrap";
import { Save, X } from "react-feather";
import { useSweetAlert } from "../../../../../../../components/custom_components/SweetAlert";
import CustomButton from "../../../../../../../components/custom_components/CustomButton";
import ModalLoading from "../../../../../../../components/custom_components/ModalLoading";
import {
  preventMinus,
  preventPasteNegative,
} from "../../../../../../../../utility/Utils";
import { ProjectService } from "../../../../../../../../API/services/pmsService";

const createIssueModal = ({
  open,
  stateChanger,
  oneProject,
  refreshParent,
}) => {
  const [oneProjectData, setOneProjectData] = useState(null);
  const { SweetAlert, SweetAlertWithValidation } = useSweetAlert()

  const initialValues = {
    name: "",
    description: "",
    summary:""
  };

  const schema = Yup.object().shape({
    id: Yup.number().typeError("Invalid Type").nullable(),
    name: Yup.string()
      .trim()
      .typeError("Invalid Type")
      .required("Name is required")
      .max(70, "Max 70 characters allowed"),
    description: Yup.string().trim().typeError("Invalid Type").nullable(),
    summary: Yup.string().trim().typeError("Invalid Type").nullable(),
  });

  const formik = useFormik({
    isLoading: false, // Add your loading state here
    validationSchema: schema,
    initialValues: initialValues,
    onSubmit: (values) => {
      addIssue(values);
    },
  });

  useEffect(() => {
    if (oneProjectData) {
      formik.setValues({
        id: oneProjectData.id,
        name: oneProjectData.name,
        description: oneProjectData.description,
        summary: oneProjectData.summary
      });
    } else {
      formik.handleReset();
    }
  }, [oneProjectData]);

  //Api call to add a Project
  const { mutate: addIssue, isLoading: addingIssue } =
    ProjectService.createIssue({
      onSuccess: (response) => {
        console.log(response);
        if (response.data.isSuccess == true) {
          SweetAlert("success", response.data.message);
          stateChanger(false);
          refreshParent(Math.random());
          formik.handleReset();
        } else {
          const errs = response.data.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
            return;
          } else {
            SweetAlert("error", response.data.message);
          }
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
      },
    });

  //#endregion

  const handleClose = () => {
    stateChanger(false);
    formik.handleReset();
    setOneProjectData(null);
  };

  return (
    <Modal
      isOpen={open}
      toggle={handleClose}
      contentClassName="p-0"
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
      scrollable
    >
      <ModalHeader tag="h4" toggle={handleClose}>
        Add New Project
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        {false ? ( // Change this condition to your loading state
          <ModalLoading />
        ) : (
          <form>
            <div className="alert alert-info px-1 py-50">
              <h6 className="mb-0">
                Required fields are represented by{" "}
                <span className="text-danger fw-bolder">' * '</span>
              </h6>
            </div>

            <div className="row mt-1 mb-1">
              <div className="col-lg-6 form-group">
                <div className="row mt-1 mb-1">
                  <div className="col-lg-12 form-group">
                    <Label className="form-label" for="name">
                      Name<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Project Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.errors.name && formik.touched.name && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="col-lg-12 form-group">
                <Label className="form-label" for="leadName">
                  Summary<span className="text-danger"> *</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="summary"
                  name="summary"
                  placeholder="summary"
                  value={formik.values.summary}
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("summary")}
                />
                {formik.errors.summary && formik.touched.summary && (
                  <div
                    style={{ display: "block" }}
                    className="invalid-feedback"
                  >
                    {formik.errors.summary}
                  </div>
                )}
              </div>
              
              <div className="col-lg-12 form-group">
                <Label className="form-label" for="leadName">
                  Description<span className="text-danger"> *</span>
                </Label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("description")}
                />
                {formik.errors.description && formik.touched.description && (
                  <div
                    style={{ display: "block" }}
                    className="invalid-feedback"
                  >
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </ModalBody>
      <ModalFooter>
        <CustomButton
          onClick={() => {
            formik.handleSubmit();
          }}
          disabled={false} // Add your loading state here
          loading={addingIssue} // Add your loading state here
          color="primary"
          className="d-flex align-items-center justify-content-center"
        >
          <Save size={14} />
          <span className="ms-50 mt-1px">Create</span>
        </CustomButton>
      </ModalFooter>
    </Modal>
  );
};

export default createIssueModal;
