import { lazy } from 'react'

const Home = lazy(() => import('../../views/pages/efs'))

const EFSRoutes = [
  {
    element: <Home />,
    path: '/efs',
  },
  {
    element: <Home />,
    path: '/employee/list',
  },
]

export default EFSRoutes