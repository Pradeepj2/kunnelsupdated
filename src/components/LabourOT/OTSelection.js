import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { connect, Connect } from "react-redux";
import { labours_list, users_list } from "../../redux/actions/siteActions";
import { Button } from "react-bootstrap";
const columns = [
  { id: "sitecode", label: "Site Code" },
  { id: "labourerid", label: "Labour ID" },
  { id: "intime", label: "Checked In" },
  { id: "outtime", label: "Checked Out" },
  { id: "selector_name", label: "Selector Name" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = (props) => {
  const [rows, setRows] = useState([]);
  const [objectListArray, setObjectListArray] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userList, setUserList] = useState([]);
  const [sitecode, Setsitecode] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/user`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        props.users_list(res.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const setUserSiteCode = (e) => {
    objectListArray.map((res) => {
      if (res.name === e.target.innerText) Setsitecode(res.id);
    });
  };

  // const getUnique = (array, key) => {
  //   if (typeof key !== "function") {
  //     const property = key;
  //     key = function (item) {
  //       return item[property];
  //     };
  //   }
  //   return Array.from(
  //     array
  //       .reduce(function (map, item) {
  //         const k = key(item);
  //         if (!map.has(k)) map.set(k, item);
  //         return map;
  //       }, new Map())
  //       .values()
  //   );
  // };

  // useEffect(() => {
  //   if (sitecode) {
  //     const obj = [];
  //     rows.map((res, idx) => {
  //       if (res.id === sitecode) {
  //         console.log(res.name, res.site_code, sitecode);
  //         obj.push(...obj, res);
  //       }
  //     });

  //     const newArry = getUnique(obj, "id");
  //     if (newArry.length !== 0) setRows(newArry);
  //   }
  // }, [sitecode]);

  useEffect(() => {
    const curr_date = new Date();

    let Data = {
      current_date: curr_date.toISOString().split("T")[0],
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selection_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setRows(response.data);
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const tempArry = [];
    const tempuserNameArry = [];
    if (props.users) {
      const data = props.users.map((res) => {
        tempArry.push({ name: res.username, id: res.id });
        tempuserNameArry.push(res.username);
      });
      setUserList(tempuserNameArry);
      setObjectListArray(tempArry);
    }
  }, [props.users]);

  // *****************************************************

  // useEffect(() => {
  //   if (objectListArray) console.log(objectListArray);
  // }, [objectListArray]);

  // **********************************************************

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const selectHandler = (row) => {
    let Data = {
      selected_for_ot: !row.selected_for_ot,
      selector_name: localStorage.getItem("user"),
    };
    // console.log(row.id, Data);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selector_name_approval_authorized/${row.id}/ `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          revalidate();
          window.location.reload();
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const revalidate = () => {
    const curr_date = new Date();
    let Data = {
      current_date: curr_date.toISOString().split("T")[0],
    };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selection_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setRows(response.data);
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Paper className={classes.root} style={{ marginTop: "5%" }}>
        <TableContainer className={classes.container}>
          {false ? (
            <Spinner
              animation="border"
              role="status"
              className="loading"
              style={{ left: "120vh" }}
            ></Spinner>
          ) : null}

          <Autocomplete
            onChange={(e) => setUserSiteCode(e)}
            disablePortal
            id="combo-box-demo"
            options={userList}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Select User" />
            )}
          />
          <Table
            style={{ minWidth: "1400px" }}
            stickyHeader
            aria-label="sticky table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Sl.No"
                >
                  Sl.No.
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "navy",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "navy",
                  }}
                  key="Options"
                >
                  Options
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!(rows.length === 0) ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                        <TableCell key="Sl.No">
                          {rows.indexOf(row) + 1}
                        </TableCell>
                        {columns.map((column, idx) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={idx} align={column.align}>
                              {column.id === "date_joined"
                                ? column.format(value)
                                : column.id === "first_name"
                                ? value + " " + row.last_name
                                : value}
                            </TableCell>
                          );
                        })}
                        <TableCell key="Options">
                          <span>
                            <Checkbox
                              onClick={() => selectHandler(row)}
                              checked={row.selected_for_ot}
                              disabled={props.approvalId.some(
                                (ele) => ele === row.id
                              )}
                            />
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow></TableRow>
              )}
            </TableBody>
          </Table>
          {!rows.length ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ margin: "100px", fontSize: "17px" }}>
                  {"No Results Found"}
                </div>
              </div>
            </>
          ) : null}
        </TableContainer>
        <Button style={{ backgroundColor: "navy" }}>Create OT</Button>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
    laboursData: state.laboursData,
  };
};

export default connect(mapStateToProps, { users_list, labours_list })(
  StickyHeadTable
);
