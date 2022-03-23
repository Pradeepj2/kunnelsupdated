import React,{ useState,useEffect } from 'react';
import { Form, Button, Modal, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import axios from 'axios';
import SiteModal from '../utilModals/siteModal'
import LabourModal from '../utilModals/LabourModal';


const EditConcrete = (props) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  const [siteCode,setSiteCode] = useState((props.row)?props.row.site_code:"")
  const [siteid,setSiteid] = useState("")
  const [show,setShow] = useState(false)
  const [showLabour,setShowLabour] = useState(false)
  const [labourerId,setLabourerId] = useState((props.row)?props.row.labour_id:"")
  const [catArr,setCatArr] = useState([])
  const [typeArr,setTypeArr] = useState([])
  

  useEffect(()=>{

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concreteload/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      ).then(res=>{
        if(res.status===200)
        {
          setTypeArr(res.data)
        }
      }).catch(err=>console.log(err))

      axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretecategory/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      ).then(res=>{
        if(res.status===200)
        {
          setCatArr(res.data)
        }
      }).catch(err=>console.log(err))

      axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concreteload/  `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      ).then(res=>{
        if(res.status===200)
        {
          setTypeArr(res.data)
        }
      }).catch(err=>console.log(err))



  },[])

  useEffect(()=>{
    setSiteCode(props.row.site_code)
    setLabourerId(props.row.labour_id)
  },[props.row])

  const viewHandler = ()=>{
    setShow(true)
  }


  const onSubmitConcreteCat = (data) => {
     const curr_date = new Date();

    let Data = {
      site_code:siteCode,
      labour_id:labourerId,
      date:curr_date.toISOString().split('T')[0],
      concrete_load:data.concrete_load,
      concrete_categoryname:data.concrete_type,
      amount:data.amount
    }

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/edit_delete_concretesection/${props.row.id}/`,
        Data,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
          if(response.data.status)
          {
            alert(response.data.Message)
            props.setShow(false)
            props.revalidate()
          }
          else{
            alert(response.data.Message)
          }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteHandler = ()=>{
    axios
    .delete(
      `${process.env.REACT_APP_API_URL}/SalaryStrutManage/edit_delete_concretesection/${props.row.id}/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
        if(response.data.status)
        {
          alert(response.data.Message)
          props.setShow(false)
          props.revalidate()
        }
        else{
          alert(response.data.Message)
        }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const labourHandler = ()=>{
    setShowLabour(true)
  }

  return (
    <>
      <LabourModal
      setShowLabour={setShowLabour}
      showLabour={showLabour}
      setLabourerId={setLabourerId}
      />
      <SiteModal
      show={show}
      setShow={setShow}
      setSiteCode={setSiteCode}
      setSiteid={setSiteid}
      sites={props.sites}
      />
      <Modal
        show={props.show}
        onHide={() => {
          props.setShow(false)
          setLabourerId("")
          setSiteCode("")
        }}
        style={{overflow:'auto'}}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update/Delete Concrete</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form onSubmit={handleSubmit(onSubmitConcreteCat)} >
            <Form.Row>
             <Form.Group as={Col} controlId="site">
              <Form.Label>Site Code</Form.Label>
              <div  style={{display:"flex"}}>
                <div>
              <Form.Control style={{width:'300px'}}
                type="text"
                name="site"
                value={(siteCode)?siteCode:props.row.site_code}
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
            <Form.Group as={Col} controlId="concrete_type" >
                <Form.Label>Concrete Type</Form.Label>
                <Form.Control
                  as="select"
                  name="concrete_type"
                  defaultValue={(props.row)?props.row.concrete_categoryname:""}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select</option>
                  {catArr.map((obj,idx)=>{
                        return(
                            <option key={obj.id} value={obj.categoryname}>{obj.categoryname}</option>
                        )
                    })}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="labourer_id" >
              <Form.Label>Labourer ID</Form.Label>
              <div style={{display:"flex"}}>
                  <div>
               
                <Form.Control style={{width:'300px'}}
                type="text"
                name="labourer_id"
                disabled={true}
                value={(labourerId)?labourerId:props.row.labour_id}
                ref={register({
                  required: true,
                })}
                >
                 </Form.Control>
                {errors.start_date?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
                 </div>
                 <div> <Button style={{backgroundColor:'navy'}} onClick={(e)=>labourHandler()}>View</Button></div>
                 </div>
              </Form.Group>
              <Form.Group as={Col} controlId="concrete_load" >
                <Form.Label>Concrete Capacity/Load</Form.Label>
                <Form.Control
                  as="select"
                  name="concrete_load"
                  defaultValue={props.row?props.row.concrete_load:""}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Please Select</option>
                  {typeArr.map((obj,idx)=>{
                        return(
                            <option key={obj.id} value={obj.id}>{obj.load_capacity}</option>
                        )
                    })}
                </Form.Control>
                {errors.concrete_load?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control 
                type="text"
                name="amount"
                defaultValue={props.row?props.row.amount:""}
                ref={register({
                  required: true,
                })}
                >
                </Form.Control>
                {errors.amount?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>This field is required</i>
                </small>
              </p>
            )}
              </Form.Group>
            </Form.Row>
            <Button type="submit" className="btn btn-sm">
              Update
            </Button>
            <Button className="btn btn-danger btn-sm" 
                style={{marginLeft:"2%", backgroundColor:"red", border:'red 1px solid'}}
                onClick={()=>deleteHandler()}
                >
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  sites: state.sites,
});

export default connect(mapStateToProps)(EditConcrete);
