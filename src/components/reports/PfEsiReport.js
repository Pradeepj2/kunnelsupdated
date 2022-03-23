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

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
});

const PfEsiReport = ({ report }) => {
  const rows = report;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root} style={{ marginTop: '20px' }}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Sl.No.
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                 Laobourer Id
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Designation
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Labour Category
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                PF
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                ESI
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Retention
              </TableCell>
              <TableCell
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'navy',
                }}
              >
                Advance
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
                      key={row.code}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{row.labourerid}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.desigination}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.pf}</TableCell>
                      <TableCell>{row.esi}</TableCell>
                      <TableCell>{row.retension}</TableCell>
                      <TableCell>{row.advance.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan="16" className="text-center text-danger p-5">
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
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  registerOfWages: state.registerOfWages,
});

export default connect(mapStateToProps)(PfEsiReport);
