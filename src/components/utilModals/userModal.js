// import "./siteModal.css";
// import React, { useState } from "react";
// import { Button, Form, Modal, Spinner } from "react-bootstrap";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import { makeStyles } from "@material-ui/core/styles";
// import TableHead from "@material-ui/core/TableHead";
// import TablePagination from "@material-ui/core/TablePagination";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import { connect } from "react-redux";

// const columns = [
//   { id: "site_code", label: "Site Code" },
//   { id: "username", label: "Username" },
//   { id: "first_name", label: "Name" },
//   { id: "emailid", label: "Email Address" },
//   {
//     id: "date_joined",
//     label: "Date of Creation",
//     minWidth: 170,
//     format: (value) => value.slice(0, 10).split("-").reverse().join("-"),
//   },
//   { id: "user_type", label: "User Type" },
//   { id: "role", label: "Role" },
// ];

// const useStyles = makeStyles({
//   root: {
//     width: "100%",
//   },
//   container: {
//     maxHeight: 500,
//   },
// });
// const UserModal = (props) => {
//   //##############################declaring states####################//
//   // const [code, setCode] = useState("");
//   const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState([]);
//   const [tempUser, SetTempUser] = useState("");
//   const users = props.users;
//   const sortedData = users.sort(function (a, b) {
//     return new Date(a.date_joined) - new Date(b.date_joined);
//   });
//   const rows = sortedData.reverse();
//   const classes = useStyles();
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const checkHandler = (e, idx) => {
//     var selected = [];
//     var n = rows
//       .filter((obj) =>
//         JSON.stringify(obj).toLowerCase().includes(query.toLowerCase())
//       )
//       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     for (var i = 0; i < n.length; i++) {
//       if (i === idx) {
//         selected.push(n[i]);
//       }
//     }
//     setSelected(selected);
//   };

//   return (
//     <>
//       <Modal
//         show={props.show}
//         style={{ zIndex: "9999999999999999999" }}
//         onHide={() => {
//           props.setShowUserModal(false);
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Select User</Modal.Title>
//           <div style={{ width: "50%", transform: "translateX(30%)" }}>
//             <Form.Control
//               style={{ textAlign: "center" }}
//               type="text"
//               placeholder="Search"
//               onChange={(e) => setQuery(e.target.value)}
//             />
//           </div>
//         </Modal.Header>
//         <Modal.Body>
//           {!props.users.length ? (
//             <Spinner
//               animation="border"
//               role="status"
//               className="loading"
//               style={{ left: "120vh" }}
//             ></Spinner>
//           ) : null}
//           <Paper className={classes.root}>
//             <TableContainer className={classes.container}>
//               <Table
//                 style={{ minWidth: "600px" }}
//                 stickyHeader
//                 aria-label="sticky table"
//                 size="small"
//               >
//                 <TableHead>
//                   <TableRow>
//                     <TableCell
//                       style={{
//                         fontWeight: "bold",
//                         color: "white",
//                         backgroundColor: "navy",
//                       }}
//                     >
//                       Select
//                     </TableCell>
//                     <TableCell
//                       style={{
//                         fontWeight: "bold",
//                         color: "white",
//                         backgroundColor: "navy",
//                       }}
//                       key="Sl.No"
//                     >
//                       SI.No
//                     </TableCell>
//                     {columns.map((column) => (
//                       <TableCell
//                         key={column.id}
//                         align={column.align}
//                         style={{
//                           fontWeight: "bold",
//                           color: "white",
//                           backgroundColor: "navy",
//                         }}
//                       >
//                         {column.label}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {!(Object.entries(rows).length === 0) ? (
//                     rows
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, idx) => {
//                         return (
//                           <TableRow
//                             hover
//                             role="checkbox"
//                             tabIndex={-1}
//                             key={idx}
//                           >
//                             <TableCell>
//                               <input
//                                 checked={selected.some(
//                                   (ele) => ele.id === row.id
//                                 )}
//                                 onChange={(e) => {
//                                   // props.setSiteid(site);
//                                   checkHandler(e, idx);
//                                   SetTempUser(row.username);
//                                   // setSite(row.site_id);
//                                 }}
//                                 type="checkbox"
//                               />
//                             </TableCell>
//                             <TableCell key="Sl.No">
//                               {rows.indexOf(row) + 1}
//                             </TableCell>
//                             {columns.map((column, idx) => {
//                               const value = row[column.id];
//                               return (
//                                 <TableCell key={idx} align={column.align}>
//                                   {column.id === "date_joined"
//                                     ? column.format(value)
//                                     : column.id === "first_name"
//                                     ? value + " " + row.last_name
//                                     : value}
//                                 </TableCell>
//                               );
//                             })}
//                           </TableRow>
//                         );
//                       })
//                   ) : (
//                     <TableRow></TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//               {/* {!rows.filter((obj) =>
//                 JSON.stringify(obj)
//                   .toLowerCase()
//                   .includes(props.query.toLowerCase())
//               ).length || !props.users.length ? (
//                 <>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div style={{ margin: "100px", fontSize: "17px" }}>
//                       {"No Results Found"}
//                     </div>
//                   </div>
//                 </>
//               ) : null} */}
//             </TableContainer>
//             <TablePagination
//               style={{ zIndex: "10000000000000" }}
//               rowsPerPageOptions={[10, 25, 100]}
//               component="div"
//               count={
//                 // rows.filter((obj) =>
//                 //   JSON.stringify(obj)
//                 //     .toLowerCase()
//                 //     .includes(props.query.toLowerCase())
//                 // ).length
//                 rows.length
//               }
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </Paper>
//           <Button
//             style={{ backgroundColor: "navy", marginTop: "10px" }}
//             onClick={(e) => submitHandler()}
//           >
//             Submit
//           </Button>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   users: state.users,
// });

// export default connect(mapStateToProps, null)(UserModal);
