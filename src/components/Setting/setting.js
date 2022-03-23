import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ConcreteCategory from './ConcreteCategory';
import Designation from './designation'
import Grade from './grade'
import ConcreteType from './ConcreteType'

const Setting = () => {


  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Setting</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent">
        <hr className="seperationLine" />
        <Tabs
          defaultActiveKey="pendingRetension"
          id="uncontrolled-tab-example"
          style={{ fontSize: '14px' }}
        >
          <Tab eventKey="pendingRetension" title="Create Designation">
            <Designation />
          </Tab>
          <Tab eventKey="approvedRetensions" title="Create Grade">
            <Grade />
          </Tab>
          <Tab eventKey="concreteCategory" title="Create Concrete Category">
            <ConcreteCategory />
          </Tab>
          <Tab eventKey="concreteType" title="Create Concrete Type">
            <ConcreteType/>
          </Tab>
        </Tabs>

          
      </div>
    </div>
  );
};

export default Setting;
