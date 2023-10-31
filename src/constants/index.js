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

export const moduleList = {
  efs: 1,
  crm: 2,
  fms: 3,
  hrm: 4,
  pms: 5,
}