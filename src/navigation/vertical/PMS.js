import { Home } from "react-feather"
import { moduleList } from "../../constants"

const FMSNavigation = [
  {
    id: "pms-home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: '/pms',
    isVisible: localStorage.getItem("moduleId") == moduleList.pms,
  },
  // {
  //   id: "pms-project",
  //   title: "Project",
  //   icon: <Home size={20} />,
  //   navLink: '/pms/project/:id',
  //   isVisible: true,
  // },
]

export default FMSNavigation