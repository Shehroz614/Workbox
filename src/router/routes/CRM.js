import { lazy } from 'react'

const Home = lazy(() => import('../../views/pages/crm'))

const CRMRoutes = [
  {
    element: <Home />,
    path: '/crm',
    meta: {
      appLayout: true,
    }
  },
]

export default CRMRoutes