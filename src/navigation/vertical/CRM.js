import { Home } from "react-feather"
import { moduleList } from "../../constants"

const CRMNavigation = [
  {
    id: "crm-home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: '/crm',
    isVisible: localStorage.getItem("moduleId") == moduleList.crm,
  },
]

export default CRMNavigation