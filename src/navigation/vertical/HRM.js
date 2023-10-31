import { Home, User } from "react-feather"
import { moduleList } from "../../constants"

const HRMNavigation = [
  {
    id: "hrm-home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: '/hrm',
    isVisible: localStorage.getItem("moduleId") == moduleList.hrm,
  },
  {
    id: "hrm-emp-management",
    title: "Employees",
    icon: <User size={20} />,
    navLink: '/employee-management',
    isVisible: localStorage.getItem("moduleId") == moduleList.hrm,
  },
]

export default HRMNavigation