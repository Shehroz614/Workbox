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

const UpdateProjectFormModal = ({
  open,
  stateChanger,
  oneProject,
  refreshParent,
}) => {
  const [oneProjectData, setOneProjectData] = useState(null);
  const { SweetAlert, SweetAlertWithValidation } = useSweetAlert()

  function convertToFormattedDate(inputDateString) {
    const originalDate = new Date(inputDateString);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const initialValues = {
    id: oneProject?.id,
    name: oneProject?.name,
    description: oneProject?.description,
    startDate: convertToFormattedDate(oneProject?.startDate),
    endDate: convertToFormattedDate(oneProject?.endDate),
    leadName: oneProject?.leadName,
    ownerId: oneProject?.projectOwner?.id,
    businessAnalystId: oneProject?.businessAnalyst?.id,
  };

  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .typeError("Invalid Type")
      .required("Name is required")
      .max(70, "Max 70 characters allowed"),
    description: Yup.string().trim().typeError("Invalid Type").nullable(),
    startDate: Yup.date()
      .typeError("Invalid Type")
      .required("Start Date is required"),
    endDate: Yup.date()
      .typeError("Invalid Type")
      .required("End Date is required"),
    leadName: Yup.string()
      .trim()
      .typeError("Invalid Type")
      .required("Lead Name is required"),
    ownerId: Yup.number()
      .typeError("Invalid Type")
      .required("Owner ID is required"),
    businessAnalystId: Yup.number()
      .typeError("Invalid Type")
      .required("Business Analyst ID is required"),
  });

  const formik = useFormik({
    isLoading: false, // Add your loading state here
    validationSchema: schema,
    initialValues: initialValues,
    onSubmit: (values) => {
      updateProject({...values, id: oneProject?.id});
    },
  });

  useEffect(() => {
    if (oneProjectData) {
      formik.setValues({
        id: oneProjectData.id,
        name: oneProjectData.name,
        description: oneProjectData.description,
        startDate: oneProjectData.startDate,
        endDate: oneProjectData.endDate,
        leadName: oneProjectData.leadName,
        ownerId: oneProjectData.ownerId,
        businessAnalystId: oneProjectData.businessAnalystId,
      });
    } else {
      formik.handleReset();
    }
  }, [oneProjectData]);


  //Api call to update a Project
  const { mutate: updateProject, isLoading: updatingProject } =
    ProjectService.updateProject({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          SweetAlert("success", response.data.message);
          stateChanger(false);
          refreshParent(Math.random());
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
        Update Project
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
              <div className="hidden-div">
                <input
                  type="hidden"
                  className="form-control"
                  id="id"
                  name="id"
                  value={formik.values.id}
                  onChange={formik.handleChange}
                />
              </div>
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

                  <div className="col-lg-12 form-group mt-1">
                    <Label className="form-label" for="startDate">
                      Start Date<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("startDate")}
                    />
                    {formik.errors.startDate && formik.touched.startDate && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.startDate}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-12 form-group mt-1">
                    <Label className="form-label" for="endDate">
                      End Date<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("endDate")}
                    />
                    {formik.errors.endDate && formik.touched.endDate && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.endDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 form-group">
                <div className="row mt-1 mb-1">
                  <div className="col-lg-12 form-group">
                    <Label className="form-label" for="leadName">
                      Lead Name<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="text"
                      className="form-control"
                      id="leadName"
                      name="leadName"
                      placeholder="Lead Name"
                      value={formik.values.leadName}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("leadName")}
                    />
                    {formik.errors.leadName && formik.touched.leadName && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.leadName}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-12 form-group mt-1">
                    <Label className="form-label" for="ownerId">
                      Owner ID<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="number"
                      className="form-control"
                      id="ownerId"
                      name="ownerId"
                      placeholder="Owner ID"
                      value={formik.values.ownerId}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("ownerId")}
                    />
                    {formik.errors.ownerId && formik.touched.ownerId && (
                      <div
                        style={{ display: "block" }}
                        className="invalid-feedback"
                      >
                        {formik.errors.ownerId}
                      </div>
                    )}
                  </div>
                  <div className="col-lg-12 form-group mt-1">
                    <Label className="form-label" for="businessAnalystId">
                      Business Analyst ID<span className="text-danger"> *</span>
                    </Label>
                    <input
                      type="number"
                      className="form-control"
                      id="businessAnalystId"
                      name="businessAnalystId"
                      placeholder="Business Analyst ID"
                      value={formik.values.businessAnalystId}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps("businessAnalystId")}
                    />
                    {formik.errors.businessAnalystId &&
                      formik.touched.businessAnalystId && (
                        <div
                          style={{ display: "block" }}
                          className="invalid-feedback"
                        >
                          {formik.errors.businessAnalystId}
                        </div>
                      )}
                  </div>
                </div>
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
          loading={updatingProject} // Add your loading state here
          color="primary"
          className="d-flex align-items-center justify-content-center"
        >
          <Save size={14} />
          <span className="ms-50 mt-1px">Save</span>
        </CustomButton>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateProjectFormModal;
