// ** Navigation imports

import { DollarSign } from "react-feather";
import CRMNavigation from "./CRM";
import EFSNavigation from "./EFS";
import HRMNavigation from "./HRM";
import FMSNavigation from "./FMS";
import PMSNavigation from "./PMS";

// ** Merge & Export
export default [
  ...CRMNavigation,
  ...EFSNavigation,
  ...HRMNavigation, 
  ...FMSNavigation,
  ...PMSNavigation
];
