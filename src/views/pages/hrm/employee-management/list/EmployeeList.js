// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Invoice List Sidebar
import Sidebar from "./Sidebar";

// ** Table Columns

// ** Store & Actions

import { useDispatch } from "react-redux";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  Edit,
  Trash2,
  PlusCircle,
} from "react-feather";

// ** Utils
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledTooltip,
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import CustomDataTable from "../../../../components/custom_components/CustomDataTable";
import { apiUrls } from "../../../../../API/constants";
import tableService from "../../../../../API/services/tableService";
import moment from "moment";
import AddNewEmployeeModal from "../Modals/AddNewEmployeeModal";

const CustomHeader = ({ tableData, toggleSidebar }) => {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Button className="add-new-user" color="primary" onClick={toggleSidebar}>
        Add Employee
      </Button>
    </div>
  );
};

const EmployeeList = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [tableData, settableData] = useState([]);
  const [currentDelID, setCurrentDelID] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleModal = () => setModal(!modal);

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "172px",
      sortField: "Id",
      selector: (row) => row.id,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="text-truncate mb-0">{row.id}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Name",
      sortable: true,
      minWidth: "300px",
      sortField: "fullName",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      cell: (row) => (
        <div className="d-flex align-items-center">
          {/* <Avatar img={row.profilePicture} /> */}
          <div className="user-info text-truncate ms-1 cursor-pointer">
            <span className="d-block fw-bold text-truncate text-primary">
              {`${row.firstName} ${row.lastName}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "dateOfBirth",
      sortable: true,
      minWidth: "300px",
      sortField: "dateOfBirth",
      selector: (row) => `${row.dateOfBirth}`,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="text-truncate mb-0">
              {moment(row.dateOfBirth).format("MM-DD-YYYY")}
            </small>
          </div>
        </div>
      ),
    },
    {
      name: "cnic",
      sortable: true,
      minWidth: "300px",
      sortField: "cnic",
      selector: (row) => `${row.cnic}`,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="text-truncate mb-0">{row.cnic}</small>
          </div>
        </div>
      ),
    },
    {
      name: "profilePictureUrl",
      sortable: true,
      minWidth: "300px",
      sortField: "profilePictureUrl",
      selector: (row) => `${row.profilePictureUrl}`,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="text-truncate mb-0">
              {row.profilePictureUrl}
            </small>
          </div>
        </div>
      ),
    },
    // {
    //   name: 'Role',
    //   sortable: true,
    //   minWidth: '172px',
    //   sortField: 'role',
    //   selector: row => row.role,
    //   cell: row => renderRole(row)
    // },
    // {
    //   name: 'Status',
    //   minWidth: '138px',
    //   sortable: true,
    //   sortField: 'status',
    //   selector: row => row.status,
    //   cell: row => (
    //     <Badge className='text-capitalize' color={statusObj[row.status]} pill>
    //       {row.status}
    //     </Badge>
    //   )
    // },
    {
      name: "Actions",
      allowOverflow: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        return (
          <div className="d-flex">
            {
              // permissions.includes(AllEnums.AllPermissions["Employee Management"]["edit employee"].name) &&
              <div>
                <UncontrolledTooltip
                  placement="top"
                  target={`edit-employee-${row.id}`}
                >
                  Edit Employee
                </UncontrolledTooltip>
                <Button
                  key={row.id}
                  className="btn-icon"
                  color="flat-warning"
                  id={`edit-employee-${row.id}`}
                  size="sm"
                  // disabled={ row.role=='Super Admin' }
                  onClick={() => {
                    // setOneStaff(row.id)
                    // handleModalStaffprofile()
                    document.getElementById(`edit-employee-${row.id}`).blur();
                  }}
                >
                  <Edit size={14} />
                </Button>
              </div>
            }

            {
              // permissions.includes(AllEnums.AllPermissions["Staff Management"]["delete staff"].name) &&
              <div>
                <UncontrolledTooltip
                  placement="top"
                  target={`remove-employee-${row.id}`}
                >
                  Remove Employee
                </UncontrolledTooltip>
                <Button
                  key={row.id}
                  className="btn-icon"
                  size="sm"
                  color="flat-danger"
                  // disabled={row.role=='Super Admin' }
                  id={`remove-employee-${row.id}`}
                  onClick={() => {
                    document.getElementById(`remove-employee-${row.id}`).blur();
                    setCurrentDelID(row.id);
                    // delEmployee(row.id);
                  }}
                >
                  {loading ? (
                    currentDelID == row.id ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <Trash2 size={14} />
                    )
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            }
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (apiData?.length > 0) {
      const tempArray = [];
      apiData.map((one) => {
        const element = {
          id: one.id,
          firstName: one.firstName,
          lastName: one.lastName,
          dateOfBirth: one.dateOfBirth,
          cnic: one.cnic ? one.cnic : "",

          profilePictureUrl: one.profilePictureUrl
            ? one.profilePictureUrl
            : "/assets/images/avatar-blank.png",
        };
        tempArray.push(element);
      });
      settableData(tempArray);
    } else {
      settableData([]);
    }
  }, [apiData]);
  // ** Function to toggle sidebar

  // ** User filter options
  const filters = [
    {
      name: "role",
      label: "Role",
      options: [
        { value: "", label: "Select Role" },
        { value: "admin", label: "Admin" },
        { value: "author", label: "Author" },
        { value: "editor", label: "Editor" },
        { value: "maintainer", label: "Maintainer" },
        { value: "subscriber", label: "Subscriber" },
      ],
    },
    {
      name: "status",
      label: "Status",
      options: [
        { value: "", label: "Select Status", number: 0 },
        { value: "pending", label: "Pending", number: 1 },
        { value: "active", label: "Active", number: 2 },
        { value: "inactive", label: "Inactive", number: 3 },
      ],
    },
  ];

  return (
    <Fragment>
      <div className="d-flex justify-content-end mb-1">
        <Button
          color="primary"
          onClick={handleModal}
          size={'sm'}
          className="d-flex align-items-center gap-50"
        >
          <PlusCircle size={16}/>
            Add Employee
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CustomDataTable
          data={tableData}
          loading={loading}
          columns={columns}
          border={false}
          url={apiUrls.getEmployees}
          filters={filters}
          items={apiData}
          setItems={setApiData}
          setLoading={setLoading}
        />
      </Card>

      {/* <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <AddNewEmployeeModal open={modal} handleModal={handleModal} />
    </Fragment>
  );
};

export default EmployeeList;
