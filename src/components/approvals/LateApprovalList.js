import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import LateApprovalListModal from './LateApprovalListModal'
import fileSaver from 'file-saver'

// id,type,labourer_id,amount,deduction_percent,status,applied_date

const columns = [
  { id: 'labourerid', label: 'Labourer Id', minWidth: 100 },
  { id:'designation',label:'Designation' },
  { id:'labourcategory', label:'Labour Cateogry'},
  {
    id: 'total_late_hours',
    label: 'Total Late Hours',
    minWidth: 170,
    format: (value) => value.slice(0, 10).split('-').reverse().join('-'),
  },
  { id: 'total_ot_amountt', label: 'Total Amount Deductions' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = (props) => {
  const rows = props.laList;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show,setShow] = React.useState(false)
  const [labourerid,setLabourerid] = React.useState()


//   const approve = (data) => {
//     let Data = {
//       approved_list: [data],
//     };
//     if (localStorage.getItem('role') === 'ProjectManager') {
//       axios
//         .post(
//           `${process.env.REACT_APP_API_URL}/approvals/otapproval/project_manager_ot_approval/`,
//           Data,
//           {
//             headers: {
//               Authorization: `Token ${localStorage.getItem('token')}`,
//             },
//           }
//         )
//         .then((response) => {
//           if (response.data.status === true) {
//             alert(response.data.message);
//             window.location.reload();
//           } else {
//             alert(response.data.message);
//           }
//         })
//         .catch((error) => {
//           alert(`${error}`);
//         });
//     } else {
//       axios
//         .post(
//           `${process.env.REACT_APP_API_URL}/approvals/otapproval/site_engineer_ot_approval/`,
//           Data,
//           {
//             headers: {
//               Authorization: `Token ${localStorage.getItem('token')}`,
//             },
//           }
//         )
//         .then((response) => {
//           if (response.data.status === true) {
//             alert(response.data.message);
//             window.location.reload();
//           } else {
//             alert(response.data.message);
//           }
//         })
//         .catch((error) => {
//           alert(`${error}`);
//         });
//     }
//   };
//   const nonOt = (data) => {
//     let Data = {
//       nonot_list: [data],
//     };

//     axios
//       .post(
//         `${process.env.REACT_APP_API_URL}/approvals/otapproval/non_ot_list_update/`,
//         Data,
//         {
//           headers: {
//             Authorization: `Token ${localStorage.getItem('token')}`,
//           },
//         }
//       )
//       .then((response) => {
//         if (response.data.status === true) {
//           alert(response.data.message);
//           window.location.reload();
//         } else {
//           alert(response.data.message);
//         }
//       })
//       .catch((error) => {
//         alert(`${error}`);
//       });
//   };
//   const secondShift = (data) => {
//     let Data = {
//       secondshift: [data],
//     };

//     axios
//       .post(
//         `${process.env.REACT_APP_API_URL}/approvals/otapproval/secondshift_update/`,
//         Data,
//         {
//           headers: {
//             Authorization: `Token ${localStorage.getItem('token')}`,
//           },
//         }
//       )
//       .then((response) => {
//         if (response.data.status === true) {
//           alert(response.data.message);
//           window.location.reload();
//         } else {
//           alert(response.data.message);
//         }
//       })
//       .catch((error) => {
//         alert(`${error}`);
//       });
//   };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  //exporting to excel
  const exportHandler  = ()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/wagemanage/wages/total_late/?fromdate=${props.start}&todate=${props.end}&siteid=${props.siteid}`
    , { responseType: 'arraybuffer' })
        .then((response) => {
          var blob = new Blob([response.data], 
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fileSaver.saveAs(blob, 'lateapproval.xlsx');
        });
    

}


  return (
      <>
      <LateApprovalListModal
    show={show}
    setShow={setShow}
    Data={props.Data}
    labourerid={labourerid}
    start={props.start}
    end={props.end}
    siteid={props.siteid}
    />
      <div className="title" style={{fontSize:"15px", marginTop:"1.5em"}}>
        <span>Late Approvals</span>
        <hr className="seperationLine" />
      </div>
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          stickyHeader
          aria-label="sticky table"
          size="small"
          className="mt-3"
        >
          <TableHead>
            <TableRow>
              <TableCell
                key="sl.no"
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Sl.No
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: 'navy',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                key="status"
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
              Status
              </TableCell>
              <TableCell
                key="options"
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Options
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!(Object.entries(rows).length === 0) ? (
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row,idx) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={idx}
                    >
                      <TableCell key="sl.no">{rows.indexOf(row) + 1}</TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'applied_date'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                      <select className="select">
                      <option value="disapproved">Disapproved</option>
                      <option value="approved" selected={(row.status)}>Approved</option>
                    </select>
                      </TableCell>
                      <TableCell key="options" style={{ color:'darkblue' }}
                      onClick={()=>{

                        setLabourerid(row.labourerid)
                        setShow(true)
                      }}>
                        {/* <Button onClick={() => approve(row.id)}>Approve</Button>
                        <Button onClick={() => nonOt(row.id)}>
                          Non OT
                        </Button>{' '}
                        <Button onClick={() => secondShift(row.id)}>
                          Second shift
                        </Button> */}
                        View
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-danger p-5">
                  No Data Available!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    <Button style={{marginTop:'2em'}}  onClick={()=>(props.laList.length)?exportHandler():null}>Export To Excel</Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  otList: state.otList,
});

export default connect(mapStateToProps)(StickyHeadTable);
