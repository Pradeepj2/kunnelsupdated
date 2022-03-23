import React, { useEffect, useState } from 'react';
import './SalaryManage.css';
import { Button, Tab, Tabs, Form } from 'react-bootstrap';
import * as MdIcons from 'react-icons/md';
import PaymentList from './PaymentList';
import PaymentTransactionForm from './PaymentTransactionForm';
//import AdvanceList from './AdvanceList';
//import AdvanceTotalList from './AdvanceTotalList';
import { connect } from 'react-redux';
import { salary_codes, site_list } from '../../redux/actions/siteActions';
import {
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  apply_advance_modal,
} from '../../redux/actions/fetchActions';
import SalaryList from './SalaryList';
import CreateSalaryStructure from './CreateSalaryStructure';
import EditSalaryStructure from './EditSalaryStructure';
import ApplyAdvance from './applyAdvance/ApplyAdvance';
//import PaymentListMonthly from './PaymentListMonthly';
const SalaryManage = ({
  apply_advance_modal,
  salary_codes,
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  site_list,
}) => {
  useEffect(() => {
    salary_codes();
    advance_pending_list();
    advance_total_list();
    payment_transaction_list();
    site_list();
  }, [
    salary_codes,
    advance_pending_list,
    advance_total_list,
    payment_transaction_list,
    site_list,
  ]);

  const [query, setQuery] = useState("")

  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Salary Management</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent p-5" style={{ backgroundColor: 'white' }}>
        <Tabs
          defaultActiveKey="salaryList"
          id="uncontrolled-tab-example"
          style={{ fontSize: '14px' }}
        >
          <Tab eventKey="salaryList" title="Wage Code List">
            <div style={{display:"flex"}} className="salaryresponse">
           
              <div style={{alignItems:'left'}}>
            <Button
              className="m-3"
              onClick={() => create_salary_structure_modal(true)}
            >
              <MdIcons.MdAddToPhotos />
              {/* Create Salary Structure */}
              Create Wage Code
            </Button>
            </div>
            <div style={{width:'50%', marginTop:'14px'}}>
               <Form.Control
                style={{textAlign:'center'}}
                className="Inputresponse"
                type="text"
                placeholder="Search"
                onChange={(e)=>setQuery(e.target.value)}
      />
      </div>
            
      </div>
            <SalaryList query={query}/>
          </Tab>
          {/* <Tab eventKey="advanceLIst" title="Advance List">
            <Button
              className="m-3"
              onClick={() => apply_advance_modal({ show: true })}
            >
              <MdIcons.MdAddToPhotos />
              Apply advance
            </Button>
            <AdvanceList />
          </Tab> */}
          {/* <Tab eventKey="totalAdvanceList" title="Total Advance List">
            <AdvanceTotalList />
          </Tab> */}
          {/* <Tab eventKey="MonthlyPaymentList" title="Monthly Payment">
            <PaymentListMonthly />
          </Tab>*/}
          <Tab eventKey="paymentList" title="Weekly Payment"> 
            <PaymentList />
          </Tab>
          <Tab
            eventKey="paymentTransactionList"
            title="Monthly Transaction List"
          >
            <PaymentTransactionForm />
          </Tab>
        </Tabs>
      </div>

      <CreateSalaryStructure />
      <EditSalaryStructure />
      <ApplyAdvance />
    </div>
  );
};

export default connect(null, {
  site_list,
  salary_codes,
  advance_pending_list,
  advance_total_list,
  payment_transaction_list,
  create_salary_structure_modal,
  apply_advance_modal,
})(SalaryManage);
