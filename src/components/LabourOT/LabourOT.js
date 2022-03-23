import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import OTSelection from "./OTSelection";
import OTApproval from "./OTApproval";
import OTAuthorization from "./OTAuthorization";
import Reports from "./Reports";

const LabourOT = () => {
  const [approvalId, setApprovalId] = useState([]);
  const [body, setBody] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("userType") === "ProjectManager") {
      var element = (
        <Tabs
          defaultActiveKey="OtAuthorization"
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          <Tab eventKey="OtAuthorization" title="OT Authorization">
            <OTAuthorization />
          </Tab>
        </Tabs>
      );

      setBody(element);
    } else if (localStorage.getItem("userType") === "SiteAssitant") {
      var element = (
        <Tabs
          defaultActiveKey="OtApproval"
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          <Tab eventKey="OtApproval" title="OT Approval">
            <OTApproval approvalId={approvalId} setApprovalId={setApprovalId} />
          </Tab>
        </Tabs>
      );

      setBody(element);
    } else if (localStorage.getItem("userType") === "SiteEngineer") {
      var element = (
        <Tabs
          defaultActiveKey="OtSelection"
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          <Tab eventKey="OtSelection" title="Create OT">
            <OTSelection
              approvalId={approvalId}
              setApprovalId={setApprovalId}
            />
          </Tab>
          <Tab eventKey="OtApproval" title="OT Approval">
            <OTApproval approvalId={approvalId} setApprovalId={setApprovalId} />
          </Tab>
        </Tabs>
      );
      setBody(element);
    } else {
      var element = (
        <Tabs
          defaultActiveKey="OtSelection"
          id="uncontrolled-tab-example"
          style={{ fontSize: "14px" }}
        >
          <Tab eventKey="OtSelection" title="Create OT">
            <OTSelection
              approvalId={approvalId}
              setApprovalId={setApprovalId}
            />
          </Tab>
          <Tab eventKey="OtApproval" title="OT Approval">
            <OTApproval approvalId={approvalId} setApprovalId={setApprovalId} />
          </Tab>
          <Tab eventKey="OtAuthorization" title="OT Authorization">
            <OTAuthorization />
          </Tab>
          <Tab eventKey="OtReports" title="OT Reports">
            <Reports />
          </Tab>
        </Tabs>
      );

      setBody(element);
    }
  }, [approvalId]);

  //different revalidating functions

  return (
    <div className="subSectionContainer">
      <div className="title">
        <span>Labour OT</span>
        <hr className="seperationLine" />
      </div>
      <div className="subContent p-5" style={{ backgroundColor: "white" }}>
        {body}
      </div>
    </div>
  );
};

export default LabourOT;
