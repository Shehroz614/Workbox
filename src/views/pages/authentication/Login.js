// ** React Imports
import { Link, useLocation } from "react-router-dom"

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Third Party Components
import { useDispatch } from "react-redux"
import jwt from "jsonwebtoken"
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Alert,
  Button,
  CardText,
  CardTitle,
  UncontrolledTooltip,
  Card,
  CardBody,
  Label,
  Input
} from "reactstrap"

// ** Styles
import "@styles/react/pages/page-authentication.scss"
import { authService } from "@src/API/services/authService"
import { useFormik } from "formik"
import * as Yup from "yup"
import CustomButton from "@src/views/components/custom_components/CustomButton"
import CustomInput from "@src/views/components/custom_components/CustomInput"
import FormikProvider from "@src/views/context/formik"
import { Helmet } from "react-helmet"
import { useSweetAlert } from "../../components/custom_components/SweetAlert"
import { handleLogin } from "../../../redux/authentication"

const Login = () => {
  //#region hooks
  const location = useLocation()
  const dispatch = useDispatch()
  const { SweetAlert, SweetAlertWithValidation } = useSweetAlert()
// API call for login
const { mutate: login, isLoading: isLoggingIn } = authService.login({
  onSuccess: async (response) => {
    if (response?.data?.isSuccess == true) {
      const { token, allowedRoles, allowedModules, ...user } = response.data?.result

      dispatch(handleLogin({ token, user: { ...user, role: { id: user.id, roleName: allowedRoles[0], allowedModules, allowedRoles } }, login: true }))

      window.location.href = location?.state?.prevPath ? location?.state?.prevPath : "/"
    } else {
      const errs = response.data.result

      if (errs && Object.keys(errs)?.length > 0) {
        SweetAlertWithValidation(errs)
        
      } else {
        const errMsg = response.data.message
        SweetAlert("error", errMsg)
      }
    }
  },
  onError: (error) => {
    SweetAlert(
      "error",
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message
    )
  },
  networkMode: "always"
})
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Invalid Email"),
    password: Yup.string().trim().required("Password is required")
  })

  const loginFormik = useFormik({
    initialValues: {
      email: "admin@reporteq.com",
      password: "Admin123!"
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const payload = {
        username: values?.email?.trim(),
        password: values?.password?.trim()
      }

      login(payload)
    }
  })

  //#endregion
  //#region Event Handlers
  

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      e.preventDefault()
      loginFormik.handleSubmit()
    }
  }
  //#endregion

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <svg viewBox="0 0 139 95" version="1.1" height="28">
                <defs>
                  <linearGradient
                    x1="100%"
                    y1="10.5120544%"
                    x2="50%"
                    y2="89.4879456%"
                    id="linearGradient-1"
                  >
                    <stop stopColor="#000000" offset="0%"></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient
                    x1="64.0437835%"
                    y1="46.3276743%"
                    x2="37.373316%"
                    y2="100%"
                    id="linearGradient-2"
                  >
                    <stop
                      stopColor="#EEEEEE"
                      stopOpacity="0"
                      offset="0%"
                    ></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Artboard"
                    transform="translate(-400.000000, -178.000000)"
                  >
                    <g id="Group" transform="translate(400.000000, 178.000000)">
                      <path
                        d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                        id="Path"
                        className="text-primary"
                        style={{ fill: "currentColor" }}
                      ></path>
                      <path
                        d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                        id="Path"
                        fill="url(#linearGradient-1)"
                        opacity="0.2"
                      ></path>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.049999997"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                      ></polygon>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.099999994"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                      ></polygon>
                      <polygon
                        id="Path-3"
                        fill="url(#linearGradient-2)"
                        opacity="0.099999994"
                        points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg>
              <h2 className="brand-text text-primary ms-1">WorqBox</h2>
            </Link>
            <CardTitle tag="h4" className="mb-1">
              Welcome to WorqBox
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account
            </CardText>
            <FormikProvider formik={loginFormik}>
              <Form
                className="auth-login-form mt-2"
                onSubmit={loginFormik.handleSubmit}
              >
                <div className="mb-1">
                  <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    id="login-email"
                    placeholder="ali@example.com"
                    requiredField
                    autoFocus
                  />
                </div>
                <div className="mb-1">
                  <div className="d-flex flex-column">
                    <Link
                      to="/pages/forgot-password-basic"
                      className="align-self-end position-absolute"
                    >
                      <small>Forgot Password?</small>
                    </Link>
                    <CustomInput
                      label="Password"
                      name="password"
                      type="password"
                      id="login-password"
                      placeholder="******"
                      onKeyDown={handleKeyPress}
                      requiredField
                      isInputGroup
                    />
                  </div>
                </div>
                <div className="form-check mb-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="form-check-label" for="remember-me">
                    Remember Me
                  </Label>
                </div>
                <CustomButton loading={isLoggingIn} color="primary" block>
                  Sign in
                </CustomButton>
              </Form>
            </FormikProvider>
            <p className="text-center mt-2">
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login
