import { useState } from "react";
import CustomSelect from "./CustomSelect";
import { AllEnums } from "../constants/enums";
import { Input } from "reactstrap";
import { useEffect } from "react";

const PrioritySelect = ({ one, onChange, ...other }) => {
  const [value, setValue] = useState(one?.priorityID);

  useEffect(() => {
    setValue(one?.priorityID)
  }, [one])

  return (
    <Input
      type="select"
      className="form-control w-100"
      name="priority-select"
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e.target.value);
      }}
      value={value}
      {...other}
    >
      {AllEnums.DevicePriortyList.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Input>
  );
};

export default PrioritySelect;
