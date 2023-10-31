// ** React Imports
import { lazy } from 'react'

const ModuleMenu = lazy(() => import('../../views/pages/module-menu'))

const SharedRoutes = [
  {
    element: <ModuleMenu />,
    path: '/modules',
    meta: {
      layout: 'blank',
      className: 'module-menu-container'
    }
  },
]

export default SharedRoutes
