import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Button,Form } from 'react-bootstrap';
import * as MdIcons from 'react-icons/md';
import HolidayList from './holidayList'
import CreateHoliday from './createHoliday';
//import './UserManage.css';

const HolidayManage = () => {

  const [sites,setSites] = useState([])
  const [modal,showModal] = useState(false)
  const [siteDetail,setSiteDetails] = useState([])
  //state to hold the boolean value that whether the user type is sitesAssistant or not (for role wise login)
  const sa = (localStorage.getItem('userType')==="SiteAssitant")

  useEffect(() => {
    //api calls go here
      // axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`,{
      //   headers:{
      //     Authorization:`Token ${localStorage.getItem('token')}`
      //   }
      // }).then((res)=>setSites(res.data.data))
      // .catch((err)=>console.log(err))

      axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/count_of_holidays/`,{
        headers:{
          Authorization:`Token ${localStorage.getItem('token')}`
        }
      }).then(res=>setSites(res.data.data))
      .catch((err)=>console.log(err))

      axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      }).then((res)=>setSiteDetails(res.data.data))

  }, []);

  function revalidateList() {
    //revalidationg api calls goes here
    axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/count_of_holidays/`,{
      headers:{
        Authorization:`Token ${localStorage.getItem('token')}`
      }
    }).then((res)=>setSites(res.data.data))
    .catch((err)=>console.log(err))

    axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    }).then((res)=>setSiteDetails(res.data.data))


  }

  //######################declaring states here#########################//
  const [query,setQuery] = React.useState("");


  //########################################console logs for learning about data######################################//
  //console.log()
  
 
  return (
    <Fragment>
      <div className="subSectionContainer">
        <div className="title">
          <span>Holiday Management</span>
          <hr className="seperationLine" />
        </div>
        <div className="subContent">
          <div className="subContentHeader" style={{display:'flex',justifyContent:'space-between'}}>
            <div className="contentTitle">Holiday List</div>
      <div style={{width:'50%'}}>
      <Form.Control
      style={{textAlign:'center'}}
      className="Inputresponse"
      type="text"
      placeholder="Search"
      onChange={(e)=>setQuery(e.target.value)}

      />
      </div>
        {(!sa)?(<div>
            <span>
              <Button
                className="btn btn-sm"
                onClick={() => showModal(true)}
              >
                <MdIcons.MdAddToPhotos />
                Create Holiday
              </Button>
            </span>
            </div>):null} 
          </div>
          <hr className="seperationLine" />
           <HolidayList sa={sa} query={query} sites={sites} revalidateList={revalidateList}/> 
           <CreateHoliday modal={modal} showModal={showModal} sites={sites} siteDetail={siteDetail} revalidateList={revalidateList}/>
        </div>
      </div>
      {/* <CreateUser revalidate={revalidateList} show={show} setShow={setShow}  />
      <EditUserData revalidate={revalidateList} /> */}
    </Fragment>
  );
};

export default HolidayManage;
