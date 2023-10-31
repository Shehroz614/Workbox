import { Home } from "react-feather"
import { moduleList } from "../../constants"

const FMSNavigation = [
  {
    id: "fms-home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: '/fms',
    isVisible: localStorage.getItem("moduleId") == moduleList.fms,
  },
]

export default FMSNavigation