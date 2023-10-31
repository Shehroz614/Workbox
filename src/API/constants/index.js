export const apiUrls = {
  login: "/Account/login",
  me: "/Account/me",
  registerUser: "/Account/register",
  getEmployees: "/Employee/GetEmployees",
  addEmployee: "/Employee/CreateUpdateEmployee",

  updateUser: (id) => `/Users/${id}`,
  getUsers: "/Users/GetUsersWithPagination",
  getMaritalOptions: "/Lookup/GetMaritialStatuses",
  getBloodOptions: "/Lookup/GetBloodGroups",
  getGenderOptions: "/Lookup/GetGender",
  getNationalityOptions: "/Lookup/GetCountries",
  getBusinessOptions: "/users/business-options",
  getUserOptions: "/users/user-options",

  resendEmail: "/users/resend-email",

  getDashboardStats: "/Dashboard/GetCountDeviceTypes",
  getTableRecords: "/Dashboard/SearchByDeviceTypes",
  updatePriority: (dId, pId) =>
    `/Dashboard/UpdateMissingDevicePriority?deviceiD=${dId}&priorityID=${pId}`,
  getDashboardAccessPoints: "/dashboard/access-points",
  getDashboardCubes: "/dashboard/cubes",
  getDashboardMeters: "/dashboard/meters",
  getDashboardSiteLocationsByID: (id) => `/dashboard/site-locations/${id}`,

  //project management
  getProjects: "/Project/GetProjects",
  getProjectsDetails: (id) => `/Project/GetProjectDetails/?ProjectId=${id}`,
  createProject: "/Project/CreateUpdateProject",
  updateProject: "/Project/CreateUpdateProject",
  deleteProject: `/Project/DeleteProject`,

  //project comments
  createComment :"/Comment/CreateUpdateComment",
  updateComment :"/Comment/CreateUpdateComment",
  getComments :(id) => `/Comment/getComments?ProjectId=${id}`,
  createCommentReaction :"/Comment/CreateUpdateCommentReaction",
  updateCommentReaction :"/Comment/CreateUpdateCommentReaction",
  deleteCommentReaction : "/Comment/DeleteCommentReaction",

  //project issues
  createIssue:"/Project/CreateUpdateProjectIssues",
  updateIssue:"/Project/CreateUpdateProjectIssues",
  deleteIssue:"/Project/DeleteProjectIssue"
};

// SITE INFORMATION BELOW

export const siteInfo = {
  siteLongName: import.meta.env.VITE_SITE_LONG_NAME,
  siteShortName: import.meta.env.VITE_SITE_SHORT_NAME,
  admin: {
    defaultRoute: `/${import.meta.env.VITE_ADMIN_DEFAULT_ROUTE}`,
  },
  client: {
    defaultRoute: `/${import.meta.env.VITE_CLIENT_DEFAULT_ROUTE}`,
  },
  siteNameForRoute: import.meta.env.VITE_SITE_NAME_FOR_ROUTE,
};
