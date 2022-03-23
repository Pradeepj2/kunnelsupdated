import { Snackbar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import {
  toggle_user_create_model,
  user_roles,
} from "../../redux/actions/userManageActions.js";
import { site_list } from "../../redux/actions/siteActions";
import Alert from "../Shared/Alert";
import SiteModal from "../utilModals/siteModal";

const CreateUser = ({
  toggle_user_create_model,
  user_roles,
  roles,
  modelUserCreate,
  revalidate,
  users,
  show,
  setShow,
  sites,
  site_list,
}) => {
  //##################################DECLARING STATES HERE########################//
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userType, setUserType] = useState("admin");
  const [matchError, setMatchError] = useState(false);
  const [showSite, setShowSite] = React.useState(false);
  const [siteCode, setSiteCode] = useState();
  const [siteid, setSiteid] = useState("");
  const [element, setElement] = useState();

  const viewHandler = () => {
    setShowSite(true);
  };

  useEffect(() => {
    var element;
    if (userType === "admin") {
      element = (
        <Form.Control
          type="text"
          value="admin"
          name="user_type"
          ref={register({
            required: true,
          })}
        />
      );
    } else if (userType === "Finance") {
      element = (
        <Form.Control
          type="text"
          value="Finance"
          placeholder="Enter usertype"
          name="user_type"
          ref={register({
            required: true,
          })}
        />
      );
    } else {
      element = (
        <Form.Control
          as="select"
          name="user_type"
          ref={register({
            required: true,
          })}
        >
          {!(roles.length === 0) ? (
            roles
              .filter((obj) => obj.id === 8 || obj.id === 2 || obj.id === 7)
              .map((role) => {
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
      );
    }
    setElement(element);
    // ************* here i have removed element dependency cause of infinite rendering ****************
  }, [userType]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/app1/permission`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        user_roles(res.data);
      })
      .catch((error) => {
        alert("Error occured:", error);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((responses) => {
        if (responses.status === 200) {
          site_list(responses.data.data);
        } else {
          alert(responses.data);
        }
      })
      .catch((err) => console.log(err));
  }, [user_roles, site_list]);

  const { register, handleSubmit, errors, control } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    const role = {
      // password: data.password,
      // last_login: null,
      // is_superuser: false,
      // is_staff: false,
      // is_active: true,
      // date_joined: new Date(),
      // username: data.username,
      // user_type: data.user_type,
      // email: data.emailid,
      // role: data.role,
      // emailid: data.emailid,
      // active: true,
      // first_name:
      //   data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
      // last_name:
      //   data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
      // site_code: siteCode,
      // permission: [],

      password: data.password,
      lastlogin: null,
      is_superuser: true,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: "",
      is_staff: true,
      is_active: true,
      date_joined: new Date().toISOString(),
      user_type: data.user_type,
      emailid: data.emailid,
      active: true,
      role: data.role,
      site_code: siteCode,
      permissions: [],
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/app1/user`, role, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res?.data?.status) {
          setShowSuccess(true);
          setUserType("admin");
          setTimeout(() => {
            setShowSuccess(false);
            toggle_user_create_model(false);
            setSiteCode("");
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

  const HideHandler = () => {
    toggle_user_create_model(false);
    setUserType("Finance");
  };

  const emailHandler = (e) => {
    setMatchError(users.some((ele) => ele.emailid === e.target.value));
  };

  return (
    <>
      <SiteModal
        sites={sites}
        show={showSite}
        setShow={setShowSite}
        setSiteid={setSiteid}
        setSiteCode={setSiteCode}
        // siteId={siteid}
      />
      <Snackbar open={showSuccess} autoHideDuration={3000}>
        <Alert severity="success">Creating User...</Alert>
      </Snackbar>
      <Snackbar
        open={error !== null}
        autoHideDuration={1000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Modal
        show={modelUserCreate}
        onHide={() => {
          HideHandler();
          setSiteCode("");
        }}
        style={{ overflow: "auto" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
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
                  ref={register({
                    required: true,
                  })}
                />
                {errors.first_name?.type === "required" && (
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
                  ref={register({
                    required: true,
                  })}
                />
                {errors.last_name?.type === "required" && (
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
                  ref={register({
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.username?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.username?.type === "minLength" && (
                  <p className="text-danger">
                    <small>
                      <i>Username must be atleast of 6 characters</i>
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
                  onChange={(e) => emailHandler(e)}
                  ref={register({
                    required: true,
                    match: true,
                  })}
                />
                {errors.emailid?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {matchError && (
                  <p className="text-danger">
                    <small>
                      <i>Mail id already exists</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="role">
                <Form.Label>User Role</Form.Label>
                <Form.Control
                  onChange={(e) => setUserType(e.target.value)}
                  as="select"
                  name="role"
                  ref={register({
                    required: true,
                  })}
                >
                  {!(roles.length === 0) ? (
                    roles
                      .filter(
                        (obj) => obj.id === 9 || obj.id === 5 || obj.id === 1
                      )
                      .map((role) => {
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
                {errors.role?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="user_type">
                <Form.Label>User type</Form.Label>
                {element}
                {errors.user_type?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="password">
                <Form.Label>Create password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  ref={register({
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-danger">
                    <small>
                      <i>Password Length must be atleast 6</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Controller
                as={
                  <Form.Group as={Col} controlId="site">
                    <Form.Label>Site Code</Form.Label>
                    <div style={{ display: "flex" }}>
                      <div>
                        <Form.Control
                          style={{ width: "320px" }}
                          type="text"
                          name="site"
                          value={siteCode}
                          disabled={true}
                        ></Form.Control>
                        {errors.site?.type === "required" && (
                          <p className="text-danger">
                            <small>
                              <i>This field is required</i>
                            </small>
                          </p>
                        )}
                      </div>
                      <div>
                        {" "}
                        <Button
                          style={{ backgroundColor: "navy" }}
                          onClick={(e) => viewHandler()}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </Form.Group>
                }
                name="site"
                control={control}
                defaultValue=""
              />
            </Form.Row>
            <Button type="submit">Create User</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  modelUserCreate: state.modelUserCreate,
  roles: state.roles,
  users: state.users,
  sites: state.sites,
});
export default connect(mapStateToProps, {
  toggle_user_create_model,
  user_roles,
  site_list,
})(CreateUser);
