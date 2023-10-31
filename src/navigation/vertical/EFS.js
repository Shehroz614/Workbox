import { Home } from "react-feather"
import { moduleList } from "../../constants"

const EFSNavigation = [
  {
    id: "efs-home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: '/efs',
    isVisible: localStorage.getItem("moduleId") == moduleList.efs,
  },
]

export default EFSNavigation