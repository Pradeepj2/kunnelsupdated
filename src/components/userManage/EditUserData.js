import { Snackbar } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { edit_user_modal } from '../../redux/actions/fetchActions';
import { user_roles } from '../../redux/actions/userManageActions';
import Alert from '../Shared/Alert';
import SiteModal from '../utilModals/siteModal';

const EditUserData = ({
  edit_user_modal,
  user_roles,
  roles,
  editUserModal,
  editUserData,
  revalidate,
  sites
}) => {

//##################################DECLARING STATES HERE########################//
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userType,setUserType] = useState(editUserData.role)
  const [deletion,setDeletion] = useState(false)
  const [siteCode,setSiteCode] = useState()
  const [showSite,setShowSite] = React.useState(false)
  const [siteid,setSiteid] = useState("")

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/permission`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        user_roles(res.data);
      })
      .catch((error) => {
        alert('Error occured:', error);
      });

      if(editUserData)
      {
        setUserType(editUserData.role)
        setSiteCode(editUserData.site_code)
      }

  }, [user_roles,editUserData]);

  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  //deleting users
  const deleteUserHandler = (e)=>{
    setDeletion(true)
    axios.get(`${process.env.REACT_APP_API_URL}/app1/deleteuser/${editUserData.id}`,{
      headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  }).then((res)=>{
    setTimeout(() => {
      setDeletion(false);
    }, 1100);
  })
 
  }

  const viewHandler = ()=>{
    setShowSite(true)
  }

  const onSubmit = (data) => {
    
    const role = {
      username: data.username,
      user_type: data.user_type,
      role: data.role,
      emailid: data.emailid,
      active: true,
      first_name: data.first_name,
      last_name: data.last_name,
      site_code:siteCode
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/app1/userupdate`, role, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res?.data?.status) {   
          setShowSuccess(true);
          setTimeout(() => {
            setSiteCode("")
            setShowSuccess(false);
            edit_user_modal({ show: false, data: [] });
          }, 1000);
          revalidate();
        } else {
          setError(res?.data?.message);
        }
      })
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  };

  return (
    <>
       <SiteModal 
        sites={sites} 
        show={showSite} 
        setShow={setShowSite}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}/>
      {(deletion)?(<Snackbar open={showSuccess} autoHideDuration={1000}>
        <Alert severity="error">User Deleted</Alert>
      </Snackbar>):(<Snackbar open={showSuccess} autoHideDuration={1000}>
        <Alert severity="success">User details updated successfully</Alert>
      </Snackbar>)}
      <Snackbar
        open={error !== null}
        autoHideDuration={1000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Modal
        show={editUserModal}
        onHide={() => {
          edit_user_modal({ show: false, data: [] })
          setUserType("")
          setSiteCode("")
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter firstname"
                  name="first_name"
                  defaultValue={editUserData.first_name}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.first_name?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter lastname"
                  name="last_name"
                  defaultValue={editUserData.last_name}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.last_name?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  defaultValue={editUserData.username}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.username?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="emailid">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="emailid"
                  defaultValue={editUserData.emailid}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.emailid?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="role">
                <Form.Label>User Role</Form.Label>
                <Form.Control
                  onChange={(e)=>setUserType(e.target.value)}
                  as="select"
                  name="role"
                  defaultValue={editUserData.role}
                  ref={register({
                    required: true,
                  })}
                >
                  {!(roles.length === 0) ? (
                    roles.filter(obj=>(obj.id===9||obj.id===5)).map((role) => {
                      return (
                        <option key={role.id} value={role.role}>
                          {role.role}
                        </option>
                      );
                    })
                  ) : (
                    <option></option>
                  )}
                </Form.Control>
                {errors.role?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="user_type">
                <Form.Label>User type</Form.Label>
                {(userType==="Finance")?(<Form.Control
                  type="text"
                  placeholder="Enter usertype"
                  name="user_type"
                  defaultValue={editUserData.user_type}
                  ref={register({
                    required: true,
                  })}
                />):(<Form.Control 
                  as="select"
                  name="user_type"
                  defaultValue={editUserData.user_type}
                  ref={register({
                    required: true,
                  })}
                >
                  {!(roles.length === 0) ? (
                    roles.filter(obj=>(obj.id===8||obj.id===2||obj.id===7)).map((role) => {
                      return (
                        <option  key={role.id} value={role.role} >
                          {role.role}
                        </option>
                      );
                    })
                  ) : (
                    <option></option>
                  )}
                </Form.Control>)}
                
                {errors.user_type?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="site">
              <Form.Label>Site Code</Form.Label>
              <div  style={{display:"flex"}}>
                <div>
              <Form.Control style={{width:'320px'}}
                type="text"
                name="site"
                value={(siteCode)?siteCode:editUserData.site_code}
                disabled={true}
                ref={register({
                  required: true,
                })}
              >
              </Form.Control>
              {errors.site?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
              </div>
              <div>  <Button style={{backgroundColor:'navy'}} onClick={(e)=>viewHandler()}>View</Button></div>
              </div>
            </Form.Group>
            </Form.Row>
            <Button type="submit" style={{border:'blue'}}>Update User</Button>
            <Button type="delete" style={{backgroundColor:'red',border:'red', marginLeft:'20px'}} onClick={(e)=>deleteUserHandler(e)}>Delete User</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  editUserModal: state.editUserModal,
  editUserData: state.editUserData,
  roles: state.roles,
  sites:state.sites
});
export default connect(mapStateToProps, { edit_user_modal, user_roles })(
  EditUserData
);
