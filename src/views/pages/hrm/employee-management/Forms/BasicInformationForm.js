import { React, useState } from "react";
import {
  Check,
  X,
  Upload,
  Download,
  ArrowLeftCircle,
  ArrowRightCircle,
  XCircle,
  User,
  Camera,
  RefreshCw,
  Save,
  ArrowLeft,
  ArrowRight,
} from "react-feather";
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
  Form,
  FormFeedback,
  Row,
  Col,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import classnames from "classnames";
import "@styles/react/libs/flatpickr/flatpickr.scss";

// import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import "@styles/react/libs/react-select/_react-select.scss";
import * as yup from "yup";
import { useFormik } from "formik";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import avatarBlank from "@src/assets/images/avatars/avatar-blank.png";
import employeeService from "../../../../../API/services/employeeService";
import { useQueryClient } from "@tanstack/react-query";
import lookupService from "../../../../../API/services/lookupService";
import { useSweetAlert } from "../../../../components/custom_components/SweetAlert";
import { useEffect } from "react";
import CustomSelect from "../../../../components/custom_components/CustomSelect";
import { FormProvider } from "react-hook-form";
import FormikProvider from "../../../../context/formik";

const BasicInfoForm = ({ handleModal, stepper }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [maritalOptions, setMaritalOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [bloodgroupOptions, setBloodgroupOptions] = useState([]);
  const { SweetAlert, SweetAlertWithValidation } = useSweetAlert();
  const { data: maritialdata, isLoading: loadingMaritial } =
    lookupService.getMaritalOptions(["get-maritalOptions"], "", "", {
      onSuccess: (response) => {},
      onError: (error) => {
        console.log(error);
      },
      retry: false,
      refetchOnWindowFocus: false,
    });
  const { data: nationalitydata, isLoading: loadingNationality } =
    lookupService.getNationalityOptions(["get-nationalityOptions"], "", "", {
      onSuccess: (response) => {},
      onError: (error) => {
        console.log(error);
      },
      retry: false,
      refetchOnWindowFocus: false,
    });
  const { data: genderdata, isLoading: loadingGender } =
    lookupService.getGenderOptions(["get-genderOptions"], "", "", {
      onSuccess: (response) => {},
      onError: (error) => {
        console.log(error);
      },
      retry: false,
      refetchOnWindowFocus: false,
    });
  const { data: boodGroupdata, isLoading: loadingBloodGroup } =
    lookupService.getBloodOptions(["get-bloodOptions"], "", "", {
      onSuccess: (response) => {},
      onError: (error) => {
        console.log(error);
      },
      retry: false,
      refetchOnWindowFocus: false,
    });
  const addEmployeeSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    middleName: yup.string().required("Middle name is required"),
    email: yup.string().required("Email is required"),
    gender: yup.string().required("Gender is required"),
    nationality: yup.string().required("Nationality is required"),
    maritalStatus: yup.string().required("Marital status is required"),
    fatherName: yup.string().required("Father name is required"),
    cnic: yup.string().required("CNIC is required"),
    passportNumber: yup.string().required("Passport number is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: "",
      nationality: "",
      maritalStatus: "",
      fatherName: "",
      cnic: "",
      passportNumber: "",
    },
    validationSchema: addEmployeeSchema,
    onSubmit: (values) => {
      const payload = {
        id: 0,
        email: values.email,
        firstName: values.firstName,
        middleName: values.middleName,
        fatherName: values.fatherName,
        employeeNumber: values.employeeNumber,
        passportNumber: values.passportNumber,
        licenceNumber: "",
        ethnicity: "",
        religion: "",
        placeOfBirth: values.placeOfBirth,
        genderId: values.gender,
        bloodGroupId: values.bloodGroup,
        nationalityId: values.nationality,
        domicileProvinceRegionId: 0,
        lastName: values.lastName,
        dateOfBirth: moment(values.dateOfBirth).toISOString(),
        profilePictureUrl: "",
        cnic: values.cnic,
        maritalStatusId: values.maritalStatus,
        tenantId: 0,
      };
      // eslint-disable-next-line no-use-before-define
      createEmployee(payload);
    },
  });
  const { mutate: createEmployee, isLoading: creatingEmployee } =
    employeeService.addEmployee({
      onSuccess: (response) => {
        SweetAlert("success", response.data.message);
        queryClient.invalidateQueries("get-employees");
        formik.handleReset();
        handleModal(false);
      },
      onError: (error) => {
        SweetAlert("error", error.message);
      },
    });

  const [avatar, setAvatar] = useState(avatarBlank);
  const handleOnChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const handleImgReset = () => {
    setAvatar(avatarBlank);
  };
  useEffect(() => {
    if (maritialdata != undefined) {
      const tempArray = [];
      maritialdata?.data?.result?.data?.map((one) => {
        const element = {
          label: one.name,
          value: one.id,
        };
        tempArray.push(element);
      });
      setMaritalOptions(tempArray);
    }
    if (genderdata != undefined) {
      const tempArray = [];
      genderdata?.data?.result?.data?.map((one) => {
        const element = {
          label: one.name,
          value: one.id,
        };
        tempArray.push(element);
      });
      setGenderOptions(tempArray);
    }
    if (nationalitydata != undefined) {
      const tempArray = [];
      nationalitydata?.data?.result?.data?.map((one) => {
        const element = {
          label: one.name,
          value: one.id,
        };
        tempArray.push(element);
      });
      setNationalityOptions(tempArray);
    }
    if (boodGroupdata != undefined) {
      const tempArray = [];
      boodGroupdata?.data?.result?.data?.map((one) => {
        const element = {
          label: one.name,
          value: one.id,
        };
        tempArray.push(element);
      });
      setBloodgroupOptions(tempArray);
    }
  }, [maritialdata, genderdata, nationalitydata, boodGroupdata]);

  return (
    <>
      {
        <FormikProvider formik={{ ...formik, isLoading: creatingEmployee }}>
          <Form>
            <Row>
              <Col xs={12} className="border-right-cell">
                <div className="d-flex mb-2">
                  <div className="me-25">
                    <img
                      className="rounded me-50"
                      src={avatar}
                      alt="Generic placeholder image"
                      height="100"
                      width="100"
                    />
                  </div>
                  <div className="d-flex align-items-end mt-75 ms-1">
                    <div>
                      <Button
                        tag={Label}
                        className="mb-75 me-75"
                        size="sm"
                        color="primary"
                      >
                        <Upload size={12} />
                        <span className="align-middle ms-25">Upload</span>
                        <Input
                          type="file"
                          onChange={handleOnChange}
                          hidden
                          accept="image/*"
                        />
                      </Button>
                      <Button
                        className="mb-75"
                        color="secondary"
                        size="sm"
                        outline
                        onClick={handleImgReset}
                      >
                        <RefreshCw size={12} />
                        <span className="align-middle ms-25">Reset</span>
                      </Button>
                      <p className="mb-0">
                        Allowed JPG, GIF or PNG. Max size of 800kB
                      </p>
                    </div>
                  </div>
                </div>
                {/* <FileUploaderMultiple /> */}
              </Col>
              <Col xs={12}>
                <Row>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="firstName">
                        First Name{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jhon"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.errors.firstName && true}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <div className="invalid-feedback-cs">
                          {formik.errors.firstName}
                        </div>
                      )}
                    </div>
                  </Col>{" "}
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="middleName">
                        Middle Name{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="middleName"
                        name="middleName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.middleName && true}
                      />

                      {formik.touched.middleName &&
                        formik.errors.middleName && (
                          <div className="invalid-feedback-cs">
                            {formik.errors.middleName}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="lastName">
                        Last Name{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="lastName"
                        name="lastName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.lastName && true}
                      />

                      {formik.touched.lastName && formik.errors.lastName && (
                        <div className="invalid-feedback-cs">
                          {formik.errors.lastName}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="email">
                        Email{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.email && true}
                      />

                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback-cs">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="fatherName">
                        Father Name{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="fatherName"
                        name="fatherName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.fatherName && true}
                      />

                      {formik.touched.fatherName &&
                        formik.errors.fatherName && (
                          <div className="invalid-feedback-cs">
                            {formik.errors.fatherName}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label
                        className="form-label fw-bolder"
                        for="placeofBirth"
                      >
                        Place Of Birth{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="placeofBirth"
                        name="placeofBirth"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.placeofBirth && true}
                      />

                      {formik.touched.placeofBirth &&
                        formik.errors.placeofBirth && (
                          <div className="invalid-feedback-cs">
                            {formik.errors.placeofBirth}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="dateOfBirth">
                        DOB <span className="text-danger required-star">*</span>
                      </Label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.dateOfBirth &&
                        formik.errors.dateOfBirth && (
                          <div className="invalid-feedback-cs">
                            {formik.errors.dateOfBirth}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="cnic">
                        CNIC{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="cnic"
                        name="cnic"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.cnic && true}
                      />

                      {formik.touched.cnic && formik.errors.cnic && (
                        <div className="invalid-feedback-cs">
                          {formik.errors.cnic}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label
                        className="form-label fw-bolder"
                        for="passportNumber"
                      >
                        Passport Number{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>

                      <Input
                        id="passportNumber"
                        name="passportNumber"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        invalid={formik.errors.passportNumber && true}
                      />

                      {formik.touched.passportNumber &&
                        formik.errors.passportNumber && (
                          <div className="invalid-feedback-cs">
                            {formik.errors.passportNumber}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label
                        className="form-label fw-bolder"
                        for="maritalStatus"
                      >
                        Marital Status{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>
                      <CustomSelect
                        requiredField={true}
                        name={"maritalStatus"}
                        options={maritalOptions}
                        isLoading={loadingMaritial}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="gender">
                        Gender{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>
                      <CustomSelect
                        requiredField={true}
                        name={"gender"}
                        options={genderOptions}
                        isLoading={loadingGender}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="nationality">
                        Nationality{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>
                      <CustomSelect
                        requiredField={true}
                        name={"nationality"}
                        options={nationalityOptions}
                        isLoading={loadingNationality}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mb-1">
                      <Label className="form-label fw-bolder" for="bloodGroup">
                        Blood Group{" "}
                        <span className="text-danger required-star">*</span>
                      </Label>
                      <CustomSelect
                        requiredField={true}
                        name={"bloodGroup"}
                        options={bloodgroupOptions}
                        isLoading={loadingBloodGroup}
                      />
                    </div>
                  </Col>
                  {/* <Col md="6">
                <div className="mb-1">
                  <Label className="form-label fw-bolder" for="location">
                    Location{" "}
                    <span className="text-danger required-star">*</span>
                  </Label>
                  <Select
                    options={locationOptions}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    id="assignPosition"
                    name="location"
                    onChange={(obj) => {
                      if (obj !== null) {
                        formik.setFieldValue("location", obj.value)
                      }
                      if (obj == null) {
                        formik.setFieldValue("location", "")
                      }
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("location", true)
                    }}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="invalid-feedback-cs">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
              </Col>
              <Col md="6">
                <div className="mb-1">
                  <Label className="form-label fw-bolder" for="assignPosition">
                    Position{" "}
                    <span className="text-danger required-star">*</span>
                  </Label>
                  <Select
                    isClearable
                    options={assignedPositionOptions}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    menuPosition="fixed"
                    id="assignPosition"
                    name="assignPosition"
                    onChange={(obj) => {
                      if (obj !== null) {
                        formik.setFieldValue("assignPosition", obj.value)
                      }
                      if (obj == null) {
                        formik.setFieldValue("assignPosition", "")
                      }
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("assignPosition", true)
                    }}
                  />
                  {formik.touched.assignPosition &&
                    formik.errors.assignPosition && (
                      <div className="invalid-feedback-cs">
                        {formik.errors.assignPosition}
                      </div>
                    )}
                </div>
              </Col>
              <Col className='mb-1' md='6'>
                <Label className="fw-bolder" htmlFor="address-name">
                  Phone Number{" "}
                  <span className="text-danger required-star">*</span>
                </Label>
                
                <PhoneInput
                  inputClass="phone-input"
                  country={"us"}
                  value={formik.values.phoneNumber}
                  copyNumbersOnly={false}
                  disableCountryCode={loading}
                  disableCountryGuess={loading}
                  disableDropdown={loading}
                  disableInitialCountryGuess={loading}
                  disableSearchIcon={loading}
                  inputStyle={{ backgroundColor: loading ? skin == "dark" ? "#283046" : "#efefef" : "",
                                width: "100%"
                }}
                  inputProps={{
                  ...(loading ? { disabled: "disabled" } : {})
                  }}
                  disabled={loading}
                  onBlur={() => {
                    formik.setFieldTouched("phoneNumber", true)
                  }}
                  onChange={(phone) => {
                    formik.setFieldValue("phoneNumber", phone)
                  }}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="invalid-feedback-cs">
                    {formik.errors.phoneNumber}
                  </div>
                )}
          </Col>
              <Col md="6">
                <div className="mb-1">
                  <Label className="form-label fw-bolder" for="time-zone">
                    Account Type{" "}
                    <span className="text-danger required-star">*</span>
                  </Label>

                  <Select
                    isClearable
                    menuPosition="bottom"
                    options={timezoneOptions}
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    id="accountType"
                    name="accountType"
                    onChange={(obj) => {
                      if (obj !== null) {
                        formik.setFieldValue("accountType", obj.value)
                      }
                      if (obj == null) {
                        formik.setFieldValue("accountType", "")
                      }
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("accountType", true)
                    }}
                  />
                  {formik.touched.accountType && formik.errors.accountType && (
                    <div className="invalid-feedback-cs">
                      {formik.errors.accountType}
                    </div>
                  )}
                </div>
              </Col>
              <Col sm="12">
                <div className="mb-1">
                  <Label className="form-label fw-bolder" for="address">
                    Address <span className="text-danger required-star">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="23 baker street, NY"
                    invalid={formik.errors.address && true}
                  />

                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback-cs">
                      {formik.errors.address}
                    </div>
                  )}
                </div>
              </Col> */}
                </Row>
              </Col>
            </Row>
            <hr className="my-2" />
            <div className="d-flex justify-content-end">
              <Button
                className="me-1"
                type="button"
                color="primary"
                size="sm"
                onClick={() => {
                  formik.handleSubmit();
                }}
                disabled={!formik.isValid || !formik.dirty}
              >
                <Save size={14} />{" "}
                <span className="align-middle ms-25">Create</span>
              </Button>
              <Button color="danger" size="sm" onClick={handleModal}>
                <X size={14} />{" "}
                <span className="align-middle ms-25">Cancel</span>
              </Button>
            </div>
          </Form>
        </FormikProvider>
      }
    </>
  );
};

export default BasicInfoForm;
