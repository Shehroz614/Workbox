import { lazy } from 'react'

const Home = lazy(() => import('../../views/pages/pms'))
const Project = lazy(() => import('../../views/pages/pms/project-management/view/pages/project'))

const PSMRoutes = [
  {
    element: <Home />,
    path: '/pms',
  },
  {
    element: <Project />,
    path: '/pms/project/:id',
  },
]

export default PSMRoutes