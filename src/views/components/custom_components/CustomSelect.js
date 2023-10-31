import { useContext, useEffect, useState } from "react"
import { Fragment } from "react"
import Select from "react-select"
import { FormikContext } from "../../context/formik"
import { v4 as uuidv4 } from "uuid"
import { Label, Row } from "reactstrap"

function CustomSelect({ name, options, loading, requiredField, label, ...rest }) {
  const uniqueId = uuidv4()
  const formik = useContext(FormikContext)
  
  const [defaultSelected, setDefaultSelected] = useState({
    label: "Select ...",
    value: ""
  })

  useEffect(() => {
    if (options.length > 0) {
      options.filter((one) => {
        if (one.value === formik.values[name]) {
          setDefaultSelected({
            label: one.label,
            value: one.value
          })
        }
      })
    }
  }, [formik?.values])

  return (
    <Fragment>
      {!formik ? (
        <div style={{ color: "red" }}>Provide Formik Context</div>
      ) : (
        <>
          <Row>
            {label && (
              <Label>
                {label}
                {requiredField && <span className="text-danger">*</span>}
              </Label>
            )}
            <Select
              id={uniqueId}
              options={options}
              value={defaultSelected}
              onChange={(obj) => {
                if (obj != null) {
                  formik.setFieldValue(name, obj.value)
                } else {
                  formik.setFieldValue(name, "")
                }
              }}
              onBlur={() => {
                formik.setFieldTouched(name, true)
              }}
              menuPosition="fixed"
              isLoading={loading}
              // loadingMessage={"Getting data from server"}
              // noOptionsMessage={"No options to select"}
              isDisabled={formik.isLoading}
              {...rest}
            />

            {formik.errors[name] && formik.touched[name] && (
              <div style={{ display: "block" }} className="invalid-feedback-cs">
                {formik.errors[name]}
              </div>
            )}
          </Row>
        </>
      )}
    </Fragment>
  )
}

export default CustomSelect
