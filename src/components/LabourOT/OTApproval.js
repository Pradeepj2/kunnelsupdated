import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import TimePicker from "react-time-picker";
import { GrUpdate } from "react-icons/gr";

const columns = [
  { id: "sitecode", label: "Site Code" },
  { id: "labourerid", label: "Labour Code" },
  { id: "date", label: "Date" },
  { id: "totalhour", label: "Total Hours" },
  { id: "othours", label: "OT Hours" },
  { id: "selector_name", label: "Selector Name" },
  { id: "approver_name", label: "Approver Name" },
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
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [value, onChange] = React.useState();

  useEffect(() => {
    const yesterday = ((d) =>
      new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
      new Date()
    );
    let Data = {
      date: yesterday,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_approval_list `,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setRows(response.data);
          var arr = response.data.map((ele) => {
            if (ele.approved_ot) {
              return ele.id;
            }
          });
          props.setApprovalId(arr);
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const revalidate = () => {
    // getting yesterday's date
    const yesterday = ((d) =>
      new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
      new Date()
    );
    let Data = {
      date: yesterday,
    };

    // axios
    //   .post(
    //     `${process.env.REACT_APP_API_URL}/attendancemanage/ot_approval_list `,
    //     Data,
    //     {
    //       headers: {
    //         Authorization: `Token ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setRows(response.data);
    //       var arr = response.data.map((ele) => {
    //         if (ele.approved_ot) {
    //           return ele.id;
    //         }
    //       });
    //       props.setApprovalId(arr);
    //     } else {
    //       alert(response.data.Message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const selectHandler = (row) => {
    let Data = {
      approved_ot: true,
      approver_name: localStorage.getItem("user"),
    };

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
          alert(response.data.Message);
          window.location.reload();
          revalidate();
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const timeHandler = (data) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/attendancemanage/ot_selector_name_approval_authorized/${data}/ `,
        { othours: value },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          alert(res.data.Message);
          window.location.reload();
        } else {
          alert(res.data.Message);
        }
      })
      .catch((err) => console.log(err));
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
              {!(Object.entries(rows).length === 0) ? (
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
                              {column.id === "date_joined" ? (
                                column.format(value)
                              ) : column.id === "othours" ? (
                                <>
                                  <TimePicker
                                    value={row.othours}
                                    disableClock={true}
                                    format="HH:mm:ss"
                                    onChange={onChange}
                                    clearIcon={null}
                                  />
                                  <GrUpdate
                                    style={{ marginLeft: "5%" }}
                                    onClick={(e) => timeHandler(row.id)}
                                  />
                                </>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell key="Options">
                          <span>
                            <Checkbox
                              onClick={() => selectHandler(row)}
                              checked={row.approved_ot}
                              disabled={row.approved_ot}
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

export default StickyHeadTable;
