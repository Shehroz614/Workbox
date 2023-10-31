//#region imports
import Skeleton from "./SkeletonComponent";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Filter } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import { motion } from "framer-motion";
import "@src/@core/scss/react/libs/tables/react-dataTable-component.scss";
import Empty from "./Empty";
import HighlightComponent from "./highlight/index";
import ReactPaginate from "react-paginate";
import tableService from "../../../API/services/tableService";
import { useRef } from "react";
import classNames from "classnames";
//#endregion

const pageSizeOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
];

const CustomDataTable = ({
  columns,
  refresh,
  url,
  tableName,
  setItems,
  loading,
  setLoading,
  data,
  noDataText,
  stopSearch,
  disablePageSizeChanger,
  disablePagination,
  filters,
  expandableRows,
  expandableRowsComponent,
  hasExpandableRowsComponentProps,
  conditionalRowStyles,
  extraPayload,
}) => {
  // #region States
  const [filteredData, setFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [additionalPayload, setAdditionalPayload] = useState("");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [sortColumn, setSortColumn] = useState("");
  const [columnsWithCustomRender, setColumnsWithCustomRender] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [keyWordToHighlight, setKeyWordToHighlight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const searchInputRef = useRef(null);
  //#endregion

  // #region use effects/handlers
  const fetchItems = async (
    url,
    refresh,
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    additionalPayload,
    tableName,
    extraPayload
  ) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const [response, error] = await tableService.getTableUsers(
        url,
        pageNumber,
        pageSize,
        keyword,
        sortColumn,
        sortDirection,
        additionalPayload,
        extraPayload ? extraPayload : ""
      );
      if (response?.data?.success == true) {
        const { result } = response?.data;
        setTotalPages(result?.paginationInfo?.totalPages);
        //causing double network request
        // if (!disablePagination) {
        //   debugger
        //   setPageSize(result?.paginationInfo.pageSize);
        // }
        setTotalItems(result?.paginationInfo?.totalCount);
        setItems(
          result?.items?.map((el, idx) => {
            return {
              ...el,
              srno:
                pageNumber == 1
                  ? idx + 1
                  : `${
                      idx != 9
                        ? `${pageNumber - 1}${idx + 1}`
                        : `${pageNumber}0`
                    }`,
            };
          })
        );
      } else {
      }
    } catch {
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (url) {
      fetchItems(
        url,
        refresh,
        pageNumber,
        pageSize.value,
        sortColumn,
        sortDirection,
        additionalPayload,
        tableName,
        extraPayload
      );
    }
  }, [
    refresh,
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    additionalPayload,
    tableName,
    url,
    extraPayload,
  ]);
  useEffect(() => {
    if (columns.length > 0) {
      let columns_ = columns.map((el) => {
        if (el.isSearchAble) {
          el.cell = (row) => (
            <HighlightComponent
              value={el.selector(row)}
              keyword={keyWordToHighlight}
            />
          );
        }
        return el;
      });
      setColumnsWithCustomRender(columns_);
    }
  }, [columns, keyWordToHighlight]);

  //#endregion

  // #region Search keyword implementation below
  const handleSearch = async (searchText, additionalPayload, pageSize) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const [response, error] = await tableService.getTableUsers(
        url,
        pageNumber,
        pageSize.value,
        searchText,
        sortColumn,
        sortDirection,
        additionalPayload,
        extraPayload
      );
      if (response?.data?.success == true) {
        const { result } = response?.data;
        setKeyWordToHighlight(searchText);
        setTotalPages(result?.paginationInfo?.totalPages);
        // if (!disablePagination) {
        //   setPageSize(result?.paginationInfo?.pageSize);
        // }
        setTotalItems(result?.paginationInfo?.totalCount);
        setItems(
          result?.items?.map((el, idx) => {
            return {
              ...el,
              srno:
                pageNumber == 1
                  ? idx + 1
                  : `${
                      idx != 9
                        ? `${pageNumber - 1}${idx + 1}`
                        : `${pageNumber}0`
                    }`,
            };
          })
        );
      } else {
        setItems([]);
        setKeyWordToHighlight("");
      }
    } catch (error) {
      setItems([]);
      setKeyWordToHighlight("");
    } finally {
      setIsLoading(false);
      setLoading(false);

      setTimeout(() => {}, 5000);
    }
  };

  const debounceSearchFn = useMemo(() => debounce(handleSearch, 500), []);
  //#endregion

  // #region Function to handle Pagination

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPageSize(newPerPage);
  };

  const handleSort = async (column, sortDirection) => {
    const sortDir = sortDirection?.toUpperCase() || "";
    setSortDirection(sortDir);

    const sortCol = column?.name || "";
    setSortColumn(sortCol);
  };

  //#endregion

  // #region Custom Pagination
  const CustomPagination = () => {
    let count = 0;
    if (pageSize.value > 0)
      count = Number(Math.ceil(totalItems / pageSize.value));
    else {
      count = 1;
    }
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={pageNumber - 1}
        onPageChange={(page, page1) => {
          handlePageChange(page.selected + 1);
        }}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };
  //#endregion

  return (
    <div>
      <motion.div animate={{ opacity: 1 }} className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          sortServer
          responsive
          bordered
          striped
          highlightOnHover
          pagination={!disablePagination}
          paginationServer
          paginationComponent={CustomPagination}
          paginationPerPage={pageSize.value}
          columns={columnsWithCustomRender}
          noDataComponent={<Empty text={noDataText} />}
          sortIcon={<ChevronDown size={10} />}
          expandableRows={expandableRows}
          expandableRowsComponent={expandableRowsComponent}
          expandableRowsComponentProps={
            hasExpandableRowsComponentProps
              ? { itemsList: searchValue?.length ? filteredData : data }
              : null
          }
          conditionalRowStyles={conditionalRowStyles}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          data={searchValue?.length ? filteredData : data}
          progressPending={isLoading || loading}
          progressComponent={<Skeleton />}
          onSort={handleSort}
          subHeaderComponent={
            <motion.div className="w-100 mb-75">
              <Row className="px-1">
                {!disablePageSizeChanger && (
                  <Col md="3">
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        ...(!!disablePageSizeChanger ? { opacity: 0 } : {}),
                      }}
                    >
                      <div>
                        <Label htmlFor="rows-per-page">Rows per page</Label>
                        <Select
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              width: "8rem",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              width: "8rem",
                            }),
                          }}
                          className="react-select"
                          classNamePrefix="select"
                          type="select"
                          id="rows-per-page"
                          value={pageSize}
                          options={pageSizeOptions}
                          onChange={(selectedOption) => {
                            if (!disablePageSizeChanger) {
                              setPageNumber(1);
                              setPageSize(selectedOption);
                            }
                          }}
                          disabled={disablePageSizeChanger || isLoading}
                        />
                      </div>
                    </motion.div>
                  </Col>
                )}
                <Col className="d-flex align-items-sm-center justify-content-md-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column p-0 mt-md-0 mt-1">
                  {!stopSearch && (
                    <div>
                      <Label htmlFor="search-input">Search</Label>
                      <Input
                        placeholder="Type here..."
                        type="text"
                        id="search-input"
                        onChange={(e) => {
                          if (!stopSearch) {
                            setKeyword(e.target.value);
                            debounceSearchFn(
                              e.target.value,
                              additionalPayload,
                              pageSize
                            );
                          }
                        }}
                        ref={searchInputRef}
                      />
                    </div>
                  )}
                </Col>
              </Row>
              {filters && (
                  <div
                    className="d-flex align-items-center justify-content-end mt-50"
                  >
                    <a
                      className="d-flex align-items-center"
                      color="secondary"
                      size="sm"
                      outline
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      <Filter size={15} />
                      <span className="align-middle">Filters</span>
                    </a>
                  </div>
                )}
              <motion.div
                initial={showFilter ? { opacity: 0 } : { opacity: 1 }}
                animate={showFilter ? { opacity: 1} : { opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Row className={`p-0 ${showFilter ? "d-flex" : "d-none"}`}>
                    <Card className="shadow-none">
                      <CardBody className="pt-0 px-1">
                        <Row>
                          {filters?.map((filter, index) => {
                            return (
                              <Col>
                                <Label htmlFor={filter.label + index}>
                                  {filter.label}
                                </Label>
                                <Select
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      minWidth: "8rem",
                                    }),
                                  }}
                                  className="react-select"
                                  classNamePrefix="select"
                                  id={filter.label + index}
                                  options={filter?.options}
                                  defaultValue={filter?.options?.[0]}
                                  disabled={isLoading}
                                  onChange={(selectedOption) => {
                                    let additionalPayload_ = additionalPayload;
                                    additionalPayload_ = `&${filter.name}=${selectedOption.value}`;
                                    setAdditionalPayload(additionalPayload_);
                                  }}
                                />
                              </Col>
                            );
                          })}
                        </Row>
                      </CardBody>
                    </Card>
                </Row>
              </motion.div>
            </motion.div>
          }
        />
      </motion.div>
    </div>
  );
};

export default CustomDataTable;
