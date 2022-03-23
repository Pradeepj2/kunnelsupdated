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
import * as FcIcons from 'react-icons/fc';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import {
  advance_types,
  apply_advance_modal,
  advance_pending_list
} from '../../redux/actions/fetchActions';
import ApplyAdvance from './applyAdvance/ApplyAdvance';
// id,type,labourer_id,amount,deduction_percent,status,applied_date

const columns = [
  { id: 'labourer_id', label: 'Labourer Id', minWidth: 100 },
  { id:'site_code', label:'Site Code' },
  { id: 'designation', label: 'Designation', minWidth: 170, align: 'left' },
  { id: 'category', label: 'Labour Category', minWidth: 170, align: 'left' },
  {
    id: 'applied_date',
    label: 'Applied Date',
    minWidth: 170,
    format: (value) => value.slice(0, 10).split('-').reverse().join('-'),
  },
    
  { id: 'amount', label: 'Advance Amount', minWidth: 170 },
    
  { id: 'type', label: 'Advance Type', minWidth: 170 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
});

const StickyHeadTable = ({ advancePendingList,advance_types,advance_pending_list,
  apply_advance_modal,applyAdvanceModal }) => {
  const rows = advancePendingList;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(()=>{
      advance_pending_list()
    },[advance_pending_list])

  const advanceHandler = (data,status) => {
    let Data = {
      status:status
    };
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/advance/status_update/${data}/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          alert(response.data.Message);
          window.location.reload();
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{marginTop:'2%'}}>
    <ApplyAdvance/>
    <Button 
    style={{marginBottom:'.5%'}}
    onClick={()=>apply_advance_modal({ show: true })}
    >Create Advance</Button>
    <Paper className={classes.root} style={{ marginTop: '5px' }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
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
                key="options"
                align="center"
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
            {rows?.length &&
              rows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
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
                      <TableCell
                        key="options"
                        align="center"
                        style={{ fontSize: '20px' }}
                      >
                        <span
                          className="m-4"
                          onClick={() => advanceHandler(row.id, "A")}
                        >
                          <FcIcons.FcOk />
                        </span>
                        <span onClick={() => advanceHandler(row.id,"R")}>
                          <FcIcons.FcCancel />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
  );
};

const mapStateToProps = (state) => ({
  advancePendingList: state.advancePendingList,
  applyAdvanceModal:state.applyAdvanceModal
});

export default connect(mapStateToProps,{
  advance_types,
  apply_advance_modal,
  advance_pending_list
})(StickyHeadTable);
