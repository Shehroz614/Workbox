import React, { useEffect, useState } from "react";
import { useSweetAlert } from "../../../../../../../components/custom_components/SweetAlert";
import { ProjectService } from "../../../../../../../../API/services/pmsService";
import avatarBlank from "../../../../../../../../assets/images/avatars/avatar-blank.png";
import CustomButton from "../../../../../../../components/custom_components/CustomButton";

function Home({ project }) {
  const { SweetAlert, SweetAlertWithConfirmation, SweetAlertWithValidation } =
    useSweetAlert();
  const token = localStorage.getItem("token");
  const [employees, setEmployees] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState();

  const { data: employeesData, isFetching: isLoading } =
    ProjectService.getEmployees(["employees"], {
      onSuccess: (data) => {
        // console.log("Employees", data?.data?.result?.items)
        if (data?.data?.isSuccess) {
          setEmployees(data?.data?.result?.items);
        } else {
          handleApiError(data);
        }
      },
      onError: (error) => {
        handleApiError(error);
      },
      networkMode: "always",
      enabled: !!token && !!project?.id,
    });

  const handleApiError = (response) => {
    const errs = response?.data?.result;
    if (errs && Object.keys(errs)?.length > 0) {
      SweetAlertWithValidation(errs);
    } else {
      SweetAlert(
        "error",
        response?.data?.message || response?.data?.title || response?.message
      );
    }
  };

  // Function to assign an employee to the project
  const assignUserToProject = (employee) => {
    if (!assignedUsers.some((user) => user.id === employee.id)) {
      setAssignedUsers([...assignedUsers, employee]);
    }
  };

  // Function to remove a user from the assigned list
  const removeUserFromProject = (userId) => {
    const updatedUsers = assignedUsers.filter((user) => user.id !== userId);
    setAssignedUsers(updatedUsers);
  };


  return (
    <div>
      <h2>Home</h2>
      <h4 className="py-1">Project lead is {project.leadName}</h4>

      <div className="assigned-users">
        <h4>Assigned Users</h4>
        {assignedUsers?.length > 0 ? (
          <ul className="mt-3">
            {assignedUsers.map((user) => (
              <li key={user.id}>
                <img src={avatarBlank} alt={user.firstName} />
                {user.firstName + " " + user.lastName}
                <CustomButton
                  className="removeUser mx-1"
                  onClick={() => removeUserFromProject(user.id)}
                >
                  Remove
                </CustomButton>
              </li>
            ))}
          </ul>
        ) : (
          <div className="w-100" style={{ textAlign: "center" }}>
            <p className="mx-auto my-3">No users</p>
          </div>
        )}
      </div>

      <div className="employee-select">
        <h4>Employees</h4>
        <select
          onChange={(e) => {
            setSelectedEmployeeId(e.target.value);
          }}
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName + " " + employee.lastName}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            assignUserToProject(
              employees.find((emp) => emp.id == selectedEmployeeId)
            )
          }
        >
          Assign
        </button>
      </div>
    </div>
  );
}

export default Home;
