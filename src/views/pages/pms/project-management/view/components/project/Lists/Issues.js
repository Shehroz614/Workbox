import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Circle,
  Edit2,
  MinusCircle,
  PlusCircle,
  Save,
  User,
  XCircle,
} from "react-feather";
import { ProjectService } from "../../../../../../../../API/services/pmsService";
import { useSweetAlert } from "../../../../../../../components/custom_components/SweetAlert";
import avatarBlank from "../../../../../../../../assets/images/avatars/avatar-blank.png";
import CreateIssueModal from "../../modals/create-project-issue-modal";

const initialIssues = [
  {
    id: 1,
    text: "Main Issue 1",
    subIssues: [
      { id: 2, text: "Sub Issue 1-1", assigned: [] },
      { id: 3, text: "Sub Issue 1-2", assigned: [] },
      { id: 4, text: "Sub Issue 1-3", assigned: [] },
    ],
    assigned: [],
  },
  {
    id: 5,
    text: "Main Issue 2",
    subIssues: [
      { id: 6, text: "Sub Issue 2-1", assigned: [] },
      { id: 7, text: "Sub Issue 2-2", assigned: [] },
    ],
    assigned: [],
  },
];

const IssueList = ({ project }) => {
  const { SweetAlert, SweetAlertWithConfirmation, SweetAlertWithValidation } =
    useSweetAlert();
  const token = localStorage.getItem("token");
  const [issues, setIssues] = useState(initialIssues);
  const [newIssueText, setNewIssueText] = useState("");
  const [selectedMainIssue, setSelectedMainIssue] = useState(null);
  const [showAddIssue, setShowAddIssue] = useState(false);
  const [hoveredIssue, setHoveredIssue] = useState("");
  const [expandedIssues, setExpandedIssues] = useState([]);
  const [editIssueText, setEditIssueText] = useState("");
  const [editSubIssueText, setEditSubIssueText] = useState("");
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [editingSubIssueId, setEditingSubIssueId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState({});
  const [userAssignDiv, setUserAssignDiv] = useState("");
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const refreshParent = (prop) => {
    setRefresh(prop);
  };

  const handleAddIssue = () => {
    if (newIssueText.trim() === "") return;
    const newIssue = {
      id: Date.now(),
      text: newIssueText,
      subIssues: [],
      assigned: [],
    };
    setIssues([...issues, newIssue]);
    setNewIssueText("");
  };

  const handleDeleteIssue = (issueId) => {
    const updatedIssues = issues.filter((issue) => issue.id !== issueId);
    setIssues(updatedIssues);
    // deleteIssue({id: issueId})
  };

  const handleAddSubIssue = (parentId, subIssueText) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === parentId) {
        return {
          ...issue,
          subIssues: [
            ...issue.subIssues,
            { id: Date.now(), text: subIssueText, assigned: [] },
          ],
        };
      }
      return issue;
    });

    setIssues(updatedIssues);
  };

  const handleDeleteSubIssue = (issueId, subIssueId) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        return {
          ...issue,
          subIssues: issue.subIssues.filter(
            (subIssue) => subIssue.id !== subIssueId
          ),
        };
      }
      return issue;
    });

    setIssues(updatedIssues);
    // deleteIssue({id: issueId})
  };

  const toggleSubIssueInput = (issueId) => {
    setSelectedMainIssue(issueId === selectedMainIssue ? null : issueId);
  };

  const addExpandedIssue = (id) => {
    if (!expandedIssues.includes(id)) {
      setExpandedIssues([...expandedIssues, id]);
    }
  };

  const removeExpandedIssue = (id) => {
    if (expandedIssues.includes(id)) {
      const updatedIssues = expandedIssues.filter((issueId) => issueId !== id);
      setExpandedIssues(updatedIssues);
    }
  };

  const handleEditSubIssue = (issueId) => {
    if (editSubIssueText.trim() === "") return;
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        return {
          ...issue,
          subIssues: issue.subIssues.map((subIssue) => {
            if (subIssue.id === editingSubIssueId) {
              return {
                ...subIssue,
                text: editSubIssueText,
              };
            }
            return subIssue;
          }),
        };
      }
      return issue;
    });
    setIssues(updatedIssues);
    setEditingSubIssueId(null); // Reset the editing state
    setEditSubIssueText("");
  };

  const handleEditIssue = () => {
    if (editIssueText.trim() === "") return;
    const updatedIssues = issues.map((issue) => {
      if (issue.id === editingIssueId) {
        return {
          ...issue,
          text: editIssueText,
        };
      }
      return issue;
    });
    setIssues(updatedIssues);
    setEditingIssueId(null); // Reset the editing state
    setEditIssueText("");
  };

  const handleAssignEmployee = (issueId, subIssueId, employeeId) => {
    const employee = employees.find((employee) => employee.id == employeeId);
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        if (subIssueId) {
          return {
            ...issue,
            subIssues: issue.subIssues.map((subIssue) => {
              if (subIssue.id === subIssueId) {
                return {
                  ...subIssue,
                  assigned: [...subIssue.assigned, employee],
                };
              }
              return subIssue;
            }),
          };
        } else {
          return {
            ...issue,
            assigned: [...issue.assigned, employee],
          };
        }
      }
      return issue;
    });

    setIssues(updatedIssues);
  };

  const handleDeassignEmployee = (issueId, subIssueId, employeeId) => {
    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        if (subIssueId) {
          return {
            ...issue,
            subIssues: issue.subIssues.map((subIssue) => {
              if (subIssue.id === subIssueId) {
                return {
                  ...subIssue,
                  assigned: subIssue.assigned.filter(
                    (emp) => emp.id !== employeeId
                  ),
                };
              }
              return subIssue;
            }),
          };
        } else {
          return {
            ...issue,
            assigned: issue.assigned.filter((emp) => emp.id !== employeeId),
          };
        }
      }
      return issue;
    });

    setIssues(updatedIssues);
  };

  const getAssignedEmployees = (issueId, subIssueId) => {
    if (subIssueId) {
      const subIssue = issues
        .find((issue) => issue.id === issueId)
        .subIssues.find((sub) => sub.id === subIssueId);
      return subIssue ? subIssue.assigned : [];
    }
    const mainIssue = issues.find((issue) => issue.id === issueId);
    return mainIssue ? mainIssue.assigned : [];
  };

  const { data: employeesData, isFetching: isLoading } =
    ProjectService.getEmployees(["employees"], {
      onSuccess: (data) => {
        // console.log("Employees", data?.data?.result?.items);
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

  const { mutate: addIssue, isLoading: addingIssue } =
    ProjectService.createIssue({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          console.log(response);
        } else {
          SweetAlert("error", "Unable to create issue");
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
        setCurrentDeleteID(null);
      },
    });

  const { mutate: update, isLoading: updatingIssue } =
    ProjectService.updateIssue({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          console.log(response);
        } else {
          SweetAlert("error", "Unable to Update issue");
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
        setCurrentDeleteID(null);
      },
    });

  const { mutate: deleteIssue, isLoading: deletingIssue } =
    ProjectService.deleteIssue({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          console.log(response);
        } else {
          SweetAlert("error", "Unable to deleteIssue");
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
        setCurrentDeleteID(null);
      },
    });

  return (
    <div className="issue-list-container">
      <div className="d-flex my-1 gap-1">
        {!showAddIssue ? (
          <PlusCircle
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAddIssue(true);
              setShowAddIssueModal(true);
            }}
          />
        ) : (
          <MinusCircle
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAddIssue(false);
              setShowAddIssueModal(false);
            }}
          />
        )}
        <h4 className="my-auto">Issues</h4>
      </div>
      {showAddIssue && (
        <div className="add-issue-container">
          <input
            type="text"
            placeholder="Add new issue"
            value={newIssueText}
            className="issueInput"
            onChange={(e) => setNewIssueText(e.target.value)}
          />
          <button className="add-issue-button" onClick={handleAddIssue}>
            Add Issue
          </button>
        </div>
      )}

      <ul className="issue-list">
        {issues.map((issue, issueIndex) => (
          <li key={issue.id} className="issue-item">
            <div
              className="mainIssue"
              onMouseEnter={() => setHoveredIssue(issue.id)}
              onMouseLeave={() => setHoveredIssue("")}
            >
              <div
                style={{
                  cursor: "pointer",
                  marginRight: "5px",
                  display: "inline",
                }}
                onClick={() => {
                  toggleSubIssueInput(issue.id);
                }}
              >
                {issue.id !== selectedMainIssue ? (
                  <PlusCircle style={{ marginTop: "-2px" }} size={18} />
                ) : (
                  <MinusCircle style={{ marginTop: "-2px" }} size={18} />
                )}
              </div>
              <span>
                {issue.id === editingIssueId ? ( // Check if issue is being edited
                  <input
                    type="text"
                    className="edit-issue-input"
                    value={editIssueText}
                    onChange={(e) => setEditIssueText(e.target.value)}
                  />
                ) : (
                  issue.text
                )}
                {issue.subIssues?.length > 0 &&
                  (!expandedIssues.includes(issue.id) ? (
                    <ChevronDown
                      size={16}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => addExpandedIssue(issue.id)}
                    />
                  ) : (
                    <ChevronUp
                      size={16}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => removeExpandedIssue(issue.id)}
                    />
                  ))}
                {hoveredIssue === issue.id && !editingIssueId && (
                  <>
                    <Edit2
                      size={14}
                      style={{ cursor: "pointer" }}
                      className="edit-issue-button ml-1"
                      onClick={() => {
                        setEditingIssueId(issue.id);
                        setEditIssueText(issue.text);
                      }}
                    />
                  </>
                )}
                {editingIssueId === issue.id ? (
                  <Save
                    size={18}
                    style={{ cursor: "pointer" }}
                    className="save-issue-button ml-1"
                    onClick={handleEditIssue}
                  />
                ) : null}
                {hoveredIssue === issue.id && (
                  <>
                    <User
                      size={16}
                      style={{
                        cursor: "pointer",
                        borderRadius: "50%",
                        backgroundColor:
                          userAssignDiv === issue.id ? "lightGray" : "",
                      }}
                      className="ml-1"
                      onClick={() =>
                        setUserAssignDiv((id) =>
                          id === issue.id ? "" : issue.id
                        )
                      }
                    />
                    <button
                      className="delete-issue-button"
                      onClick={() => {
                        SweetAlertWithConfirmation(
                          "Are you sure you want to delete Issue",
                          () => {
                            handleDeleteIssue(issue.id);
                          }
                        );
                      }}
                    >
                      x
                    </button>
                  </>
                )}
                {((hoveredIssue === issue.id && userAssignDiv === issue.id) ||
                  userAssignDiv === issue.id) && (
                  <>
                    <div className="assigned-employees px-2">
                      <span>Assigned to:</span>
                      <ul>
                        {getAssignedEmployees(issue.id).map((employee) => (
                          <li key={employee?.id}>
                            <img src={avatarBlank} alt={employee.firstName} />
                            {employee?.firstName + " " + employee?.lastName}
                            <span
                              className="mx-1"
                              style={{ cursor: "pointer", fontWeight: "500" }}
                              onClick={() => {
                                handleDeassignEmployee(
                                  issue.id,
                                  null,
                                  employee.id
                                );
                              }}
                            >
                              x
                            </span>
                          </li>
                        ))}
                      </ul>
                      <select
                        onChange={(e) =>
                          handleAssignEmployee(issue.id, null, e.target.value)
                        }
                      >
                        <option value="">Assign Employee</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName + " " + employee.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {issue.id === selectedMainIssue ? (
                  <div className="add-sub-issue-container">
                    <input
                      type="text"
                      placeholder="Add a sub-issue"
                      className="issueInput"
                      style={{ marginLeft: "30px" }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddSubIssue(issue.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                ) : null}
              </span>
            </div>
            {expandedIssues.includes(issue.id) && (
              <ul className="sub-issue-list">
                {issue.subIssues.map((subIssue) => (
                  <li
                    key={subIssue.id}
                    className="sub-issue-item"
                    onMouseEnter={() => setHoveredIssue(subIssue.id)}
                    onMouseLeave={() => setHoveredIssue("")}
                  >
                    <div className="d-flex align-items-center">
                      <Circle size={7} /> &nbsp;
                      {subIssue.id === editingSubIssueId ? ( // Check if sub-issue is being edited
                        <input
                          type="text"
                          className="edit-sub-issue-input"
                          value={editSubIssueText}
                          onChange={(e) => setEditSubIssueText(e.target.value)}
                        />
                      ) : (
                        subIssue.text
                      )}
                      {hoveredIssue === subIssue.id && !editingSubIssueId && (
                        <Edit2
                          size={14}
                          style={{ cursor: "pointer" }}
                          className="edit-sub-issue-button ml-1" // Edit button for sub-issues
                          onClick={() => {
                            setEditingSubIssueId(subIssue.id); // Set the sub-issue as being edited
                            setEditSubIssueText(subIssue.text); // Populate the edit input field
                          }}
                        />
                      )}
                      {editingSubIssueId === subIssue.id ? ( // Display Save button when editing
                        <Save
                          size={18}
                          style={{ cursor: "pointer" }}
                          className="save-sub-issue-button ml-1"
                          onClick={() => handleEditSubIssue(issue.id)}
                        />
                      ) : null}
                      {hoveredIssue === subIssue.id && (
                        <>
                          <User
                            size={16}
                            style={{
                              cursor: "pointer",
                              borderRadius: "50%",
                              backgroundColor:
                                userAssignDiv === subIssue.id
                                  ? "lightGray"
                                  : "",
                            }}
                            className="ml-1"
                            onClick={() =>
                              setUserAssignDiv((id) =>
                                id === subIssue.id ? "" : subIssue.id
                              )
                            }
                          />
                          <button
                            className="delete-sub-issue-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              SweetAlertWithConfirmation(
                                "Are you sure you want to delete Issue",
                                () => {
                                  handleDeleteSubIssue(issue.id, subIssue.id);
                                }
                              );
                            }}
                          >
                            x
                          </button>
                        </>
                      )}
                    </div>
                    {((hoveredIssue === subIssue.id &&
                      userAssignDiv === subIssue.id) ||
                      userAssignDiv === subIssue.id) && (
                      <>
                        <div className="assigned-employees px-2">
                          <span>Assigned to:</span>
                          <ul>
                            {getAssignedEmployees(issue.id, subIssue.id).map(
                              (employee) => (
                                <li key={employee?.id}>
                                  <img
                                    src={avatarBlank}
                                    alt={employee.firstName}
                                  />
                                  {employee?.firstName +
                                    " " +
                                    employee?.lastName}
                                  <span
                                    className="mx-1"
                                    style={{
                                      cursor: "pointer",
                                      fontWeight: "500",
                                    }}
                                    onClick={() => {
                                      handleDeassignEmployee(
                                        issue.id,
                                        subIssue.id,
                                        employee.id
                                      );
                                    }}
                                  >
                                    x
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                          <select
                            onChange={(e) =>
                              handleAssignEmployee(
                                issue.id,
                                subIssue.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="">Assign Employee</option>
                            {employees.map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.firstName + " " + employee.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      
      {showAddIssueModal && (
        <div>
          <CreateIssueModal
            open={showAddIssueModal}
            stateChanger={setShowAddIssueModal}
            refreshParent={refreshParent}
          />
        </div>
      )}
    </div>
  );
};

export default IssueList;
