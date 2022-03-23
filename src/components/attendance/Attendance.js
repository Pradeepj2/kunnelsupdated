import React from 'react';
import './Attendance.css';
import {  Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { site_list } from '../../redux/actions/siteActions';
import { attendance } from '../../redux/actions/fetchActions';
import AttendanceTable from './AttendanceTable';
import CurrentAttendanceTable from './CurrentAttendanceTable'
const Attendance = ({ sites, site_list}) => {


  return (
    <div className="subSectionContainer">
          {/* {(loading)?( <Spinner animation="border" role="status" className="loading">
        </Spinner>):null} */}
      <div className="title">
        <span>Attendance</span>
        <hr className="seperationLine" />
      </div>
      {/* <div className="subContent"> */}
      <div className="subContent p-5" style={{ backgroundColor: 'white' }}>
        <Tabs
          defaultActiveKey="currentReport"
          id="uncontrolled-tab-example"
          style={{ fontSize: '14px' }}
        >
          <Tab eventKey="currentReport" title="Current Attendance">
            <CurrentAttendanceTable/>      
          </Tab>
          <Tab eventKey="pastReport" title="Past Attendance">
            <AttendanceTable/> 
          </Tab>
        </Tabs>
      </div>
      </div>
    // </div>
  );
};
const mapStateToProps = (state) => ({
  sites: state.sites,
});
export default connect(mapStateToProps, { site_list, attendance })(Attendance);
