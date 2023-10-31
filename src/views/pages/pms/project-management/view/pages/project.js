import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import Dashboard from "../components/project/Dashboard";
import Home from "../components/project/Home";
import Files from "../components/project/Files";
import Lists from "../components/project/Lists";
import { useSweetAlert } from "../../../../../components/custom_components/SweetAlert";
import { Helmet } from "react-helmet";
import { siteInfo } from "@src/constants";
import { ProjectService } from "../../../../../../API/services/pmsService";
import ComponentSpinner from "../../../../../../@core/components/spinner/Loading-spinner";
import { useEffect } from "react";

function project() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [active, setActive] = useState("1");
  const { SweetAlert } = useSweetAlert();
  const [project, setProject] = useState({});

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const { data: projectData, isFetching: isLoadingProject } =
    ProjectService.getProjectsDetails(["projects"], id, {
      onSuccess: (data) => {
        if (data?.data?.isSuccess) {
          setProject(data?.data?.result);
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
      enabled: !!token && !!id,
    });

  return (
    <>
      <Helmet>
        <title>
          {project?.name || "Project"} | {siteInfo.siteLongName}
        </title>
      </Helmet>
      {isLoadingProject ? (
        <div style={{height:"90vh"}}>
          <ComponentSpinner />
        </div>
      ) : (
        <div>
          <Nav tabs>
            <div>
              <h3 style={{ margin: "8px 20px auto 0" }}>{project?.name}</h3>
            </div>
            <div>
              <p style={{ margin: "8px 20px auto 0", fontSize:"25px" }}>|</p>
            </div>
            <NavItem>
              <NavLink
                active={active === "1"}
                onClick={() => {
                  toggle("1");
                }}
              >
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === "2"}
                onClick={() => {
                  toggle("2");
                }}
              >
                Lists
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === "3"}
                onClick={() => {
                  toggle("3");
                }}
              >
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === "4"}
                onClick={() => {
                  toggle("4");
                }}
              >
                Files
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="py-50" activeTab={active}>
            <TabPane tabId="1">
              <Home project={project} />
            </TabPane>
            <TabPane tabId="2">
              <Lists project={project} />
            </TabPane>
            <TabPane tabId="3">
              <Dashboard project={project}/>
            </TabPane>
            <TabPane tabId="4">
              <Files project={project} />
            </TabPane>
          </TabContent>
        </div>
      )}
    </>
  );
}

export default project;
