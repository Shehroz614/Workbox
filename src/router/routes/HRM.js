import { lazy } from 'react'

const Home = lazy(() => import('../../views/pages/hrm'))
const EmployeeManagement = lazy(() => import('../../views/pages/hrm/employee-management'))

const HRMRoutes = [
  {
    element: <Home />,
    path: '/hrm',
  },
  {
    element: <EmployeeManagement />,
    path: '/employee-management',
  }
]

export default HRMRoutes