//#region imports
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  UncontrolledTooltip,
} from "reactstrap";
import {
  Edit,
  Check,
  X,
  ShoppingBag,
  Delete,
  Trash2,
  Eye,
} from "react-feather";
import Swal from "sweetalert2";
import { useSkin } from "@hooks/useSkin";
import CustomDataTable from "../../components/custom_components/CustomDataTable";
import { useSweetAlert } from "../../components/custom_components/SweetAlert";
import UpdateProjectFormModal from "./project-management/view/components/modals/update-project-form-modal";
import CreateProjectFormModal from "./project-management/view/components/modals/create-project-form-modal";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import { ProjectService } from "../../../API/services/pmsService";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { apiUrls } from "../../../API/constants";
import { useNavigate } from "react-router-dom";
//#endregion

const Projects = () => {
  //#region States
  const token = localStorage.getItem("token");
  const { skin } = useSkin();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(null);
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [oneProject, setOneProject] = useState(null);
  const { SweetAlert, SweetAlertWithConfirmation, SweetAlertWithValidation } = useSweetAlert();
  const columns = [
    {
      name: "Name",
      selector: (row) => row?.name,
      allowOverflow: true,
      sortable: true,
      isSearchAble: true,
    },
    {
      name: "Lead Name",
      selector: (row) => row?.leadName,
      sortable: true,
      isSearchAble: true,
    },
    {
      name: "Owner",
      allowOverflow: true,
      sortable: true,
      selector: (row) => row?.owner,
    },
    {
      name: "Description",
      selector: (row) => row?.description,
      sortable: true,
      isSearchAble: true,
    },
    {
      name: "Start Date",
      allowOverflow: true,
      selector: (row) => row?.startDate,
    },
    {
      name: "Actions",
      minWidth: "150px",
      maxWidth: "150px",
      allowOverflow: true,
      selector: (row) => row?.actions,
    },
  ];

  //#endregion States

  //#region Helpers
  const refreshParent = (prop) => {
    setRefresh(prop);
  };

  const handleDelete = (id) => {
    SweetAlertWithConfirmation("Are you sure?", () => {
      deleteProject({ id });
    });
  };
  //#endregion Helpers

  //#region Use Effects
  useEffect(() => {
    let tableData = [];
    projects?.map((one, key) => {
      const entry = {
        srno: one?.srno,
        // name: one?.name || "---",
        name: one?.name || "---",
        owner: one?.projectOwner?.firstName || "---",
        leadName: one?.leadName || "---",
        description: one?.description
          ? one?.description.length < 15
            ? one?.description
            : one?.description.slice(0, 15) + "..."
          : "---",
        startDate: one?.startDate?.slice(0, 10) || "---",
        actions: (
          <div className="d-flex align-items-center">
            <Button
              id={`viewProject${one?.id}`}
              size="sm"
              color="flat-dark"
              className="rounded-circle btn-icon"
              onClick={() => {
                navigate(`/pms/project/${one?.id}`);
              }}
            >
              <Eye size={15} />
            </Button>

            <UncontrolledTooltip
              placement="top"
              target={`viewProject${one?.id}`}
            >
              View Project
            </UncontrolledTooltip>
            <Button
              id={`editProject${one?.id}`}
              size="sm"
              color="flat-dark"
              className="rounded-circle btn-icon"
              onClick={() => {
                setOneProject(one);
                setShowUpdateProjectModal(true);
                document.getElementById(`editProject${one?.id}`).blur();
              }}
            >
              <Edit size={15} />
            </Button>

            <UncontrolledTooltip
              placement="top"
              target={`editProject${one?.id}`}
            >
              Update Project
            </UncontrolledTooltip>
            <Button
              id={`deleteProject${one?.id}`}
              size="sm"
              color="flat-dark"
              className="rounded-circle btn-icon"
              onClick={() => {
                handleDelete(one?.id);
                document.getElementById(`deleteProject${one?.id}`).blur();
              }}
            >
              <Trash2 size={15} />
            </Button>

            <UncontrolledTooltip
              placement="top"
              target={`deleteProject${one?.id}`}
            >
              Delete Project
            </UncontrolledTooltip>
          </div>
        ),
      };
      tableData.push(entry);
    });
    setData(tableData);
  }, [loading, projects]);
  //#endregion Use Effects

  //#region API Calls
  //Api call to get projects
  const { data: projectsData, isFetching: isLoadingProjects } =
    ProjectService.getProjects(["projects"], {
      onSuccess: (data) => {
        // console.log(data);
        if (data?.data?.isSuccess) {
          setProjects(data?.data?.result?.items);
        } else {
          const errs = data?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", data.data.message);
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
      networkMode: "always",
      enabled: !!token,
    });

  //Api call to delete a project
  const { mutate: deleteProject, isLoading: deletingProject } =
    ProjectService.delete({
      onSuccess: (response) => {
        if (response.data.isSuccess == true) {
          SweetAlert("success", "Project deleted Successfully");
          refreshParent(Math.random());
          setCurrentDeleteID(null);
        } else {
          SweetAlert("error", "Project not deleted");
          setCurrentDeleteID(null);
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
  //#endregion

  return (
    <div>
      <Helmet>
        <title>Projects | {siteInfo.siteLongName}</title>
      </Helmet>
      <Card actions={["collapse"]}>
        <CardHeader className="border-bottom py-1">
          <CardTitle tag="h4">Manage Projects</CardTitle>
          <div className="action-icons">
            <Button
              className=""
              color="primary"
              size="sm"
              onClick={() => {
                setOneProject(null);
                setShowCreateProjectModal(true);
              }}
            >
              <ShoppingBag size={15} />
              <span className="align-middle ms-50">Add Project</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          {isLoadingProjects ? (
            <div style={{ height: "450px" }}>
              <ComponentSpinner />
            </div>
          ) : (
            <CustomDataTable
              columns={columns}
              refresh={refresh}
              url={apiUrls.getProjects}
              tableName={"projects-listing"}
              items={projects}
              setItems={setProjects}
              loading={loading}
              setLoading={setLoading}
              data={data}
              noDataText="No Projects Found"
            />
          )}
        </CardBody>
      </Card>

      {showUpdateProjectModal && (
        <UpdateProjectFormModal
          open={showUpdateProjectModal}
          stateChanger={setShowUpdateProjectModal}
          oneProject={oneProject}
          refreshParent={refreshParent}
        />
      )}

      {showCreateProjectModal && (
        <CreateProjectFormModal
          open={showCreateProjectModal}
          stateChanger={setShowCreateProjectModal}
          oneProject={oneProject}
          refreshParent={refreshParent}
        />
      )}
    </div>
  );
};

export default Projects;
