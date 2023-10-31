// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import todo from '@src/views/theme/apps/todo/store'
import chat from '@src/views/theme/apps/chat/store'
import users from '@src/views/theme/apps/user/store'
import email from '@src/views/theme/apps/email/store'
import kanban from '@src/views/theme/apps/kanban/store'
import invoice from '@src/views/theme/apps/invoice/store'
import calendar from '@src/views/theme/apps/calendar/store'
import ecommerce from '@src/views/theme/apps/ecommerce/store'
import dataTables from '@src/views/theme/tables/data-tables/store'
import permissions from '@src/views/theme/apps/roles-permissions/store'

const rootReducer = {
  auth,
  todo,
  chat,
  email,
  users,
  kanban,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  permissions
}

export default rootReducer
