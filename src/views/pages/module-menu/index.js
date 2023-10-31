import { Book, Briefcase, DollarSign, Grid, User, Users } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardText, Col, Row } from "reactstrap";
import { moduleList } from "../../../constants";

function ModuleMenu() {

  const modules = [
    {
      icon: <User size={42}/>,
      title: "EFS",
      subtitle: "Employee Facilitation System",
      navLink: '/efs',
      id: moduleList.efs
    },
    {
      icon: <Briefcase size={42}/>,
      title: "HRM",
      subtitle: "Human Resource Management,",
      navLink: '/hrm',
      id: moduleList.hrm
    },
    {
      icon: <Users size={42}/>,
      title: "CRM",
      subtitle: "Customer Relationship Management",
      navLink: '/crm',
      id: moduleList.crm
    },
    {
      icon: <DollarSign size={42}/>,
      title: "FMS",
      subtitle: "Finance Management System",
      navLink: '/fms',
      id: moduleList.fms
    },
    {
      icon: <Book size={42}/>,
      title: "PMS",
      subtitle: "Project Management System",
      navLink: '/pms',
      id: moduleList.pms
    },
  ];

  const handleClick = (id) => {
    localStorage.setItem('moduleId', id)
  }

  return (
    <Row className="flex-column align-items-center justify-content-center align-items-center full-height p-5">
      <Col sm="12" className="d-flex flex-column align-items-center justify-content-center">
        <Grid size={52} className="text-primary"/>
        <h1 className="text-center text-primary mb-3 cursor-pointer">Select Module</h1>
      </Col>
      <Col sm="12">
        <Row>
          {modules.map((module) => (
            <Col lg="3" md="3" sm="6" xs="12">
              <Card className="animated-scale cursor-pointer" tag={'a'} href={module.navLink} onClick={() => handleClick(module.id)}>
                <CardBody className="d-flex flex-column justify-content-center align-items-center gap-50">
                  {module.icon}
                  <h3 className="text-primary p-0 m-0">{module.title}</h3>
                  <CardText className="text-center text-black">{module.subtitle}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}

export default ModuleMenu;
