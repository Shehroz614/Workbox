import { lazy } from 'react'

const Home = lazy(() => import('../../views/pages/fms'))

const FMSRoutes = [
  {
    element: <Home />,
    path: '/fms',
  },
]

export default FMSRoutes