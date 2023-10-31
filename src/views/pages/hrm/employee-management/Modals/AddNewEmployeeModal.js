// ** React Imports
import { useState, Fragment } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
// ** Third Party Components
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
} from "react-feather";

// ** Reactstrap Imports
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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";

// eslint-disable-next-line no-duplicate-imports
import { UserPlus } from "react-feather";

import FormManagement from "../Forms/BasicInformationForm";
import BasicInfoForm from "../Forms/BasicInformationForm";

// ** React Imports

const FormWithTabs = ({handleModal}) => {
  // ** State
  const [active, setActive] = useState(1);

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const tabs = [
    {
      id: 1,
      label: "Basic",
      title: "Basic Details",
      component: <BasicInfoForm handleModal={handleModal} />,
    },
    {
      id: 3,
      label: "Employement",
      title: "Employement Details",
      component: <>Employement Info</>,
    },
    {
      id: 4,
      label: "Contact",
      title: "Contact Details",
      component: <>Contact Info</>,
    },
    {
      id: 5,
      label: "Benefits",
      title: "Benefits Details",
      component: <>Benefits Info</>,
    },
    {
      id: 6,
      label: "Finance ",
      title: "Finance Details",
      component: <>Finance Info</>,
    },
    {
      id: 7,
      label: "Leave",
      title: "Leave Details",
      component: <>Leave Info</>,
    },
  ];
  return (
    <Fragment>
      <Row className="employee-details-form">
        <Col sm={2} className="nav-vertical">
          <h4 className="px-1">Information</h4>
          <Nav tabs fill vertical className="nav-left w-100">
            {tabs?.map((tab) => (
              <NavItem>
                <NavLink
                  className="border-none"
                  active={active === tab.id}
                  onClick={() => {
                    toggle(tab.id);
                  }}
                >
                  {tab.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col sm={10} style={{overflow: 'auto'}}>
            <TabContent className="py-25" activeTab={active}>
              {tabs?.map((tab) => (
                <TabPane tabId={tab.id} style={{maxHeight: '80vh'}}>
                  <div className="mb-1">
                    <h3>{tab.label}</h3>
                  </div>
                  {tab.component}
                </TabPane>
              ))}
            </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

const AddNewEmployeeModal = ({ open, handleModal }) => {
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      backdrop="static"
      keyboard={false}
      size="xl"
      centered
    >
      <ModalHeader className="mb-1" toggle={handleModal}>
        <h5 className="modal-title">
          <UserPlus className="icons-margin text-primary" />{" "}
          <span className="align-middle">Add Employee</span>
        </h5>
      </ModalHeader>
      <ModalBody style={{minHeight: '85vh', maxHeight: '85vh'}}>
        <FormWithTabs handleModal={handleModal}/>
      </ModalBody>
    </Modal>
  );
};

export default AddNewEmployeeModal;
