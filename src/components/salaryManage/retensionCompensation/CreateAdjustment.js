import axios from 'axios'
import React, {  useState, useEffect } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useForm} from 'react-hook-form';
import SiteModal from '../../utilModals/siteModal'
import LabourModal from '../../utilModals/LabourModal'
import { connect } from 'react-redux';

const CreateAdjustment = (props) => {

  //##############################declaring states####################//
  const [show, setShow] = useState(false)
  const [siteid, setSiteid] = useState("")
  const [showLabour,setShowLabour] = useState(false)
  const [labourerId,setLabourerId] = useState("")
  const [sites,setSites] = useState([])

useEffect(()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/sitemanage/sites/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      }).then((res)=>{
          if(res.data.data)
          setSites(res.data.data)
      }).catch((err)=>console.log(err))
},[])
  



  //handling form submit
  const { register, handleSubmit, errors } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = (data) => {

    let Data = {
        site_id:siteid.split("site00")[1],
        labourer_id:labourerId.split("LAB00")[1],
        adjustment_amount:data.adjustment_amount
    };
    
    //api call for creating adjustment amount
    axios
       .post(`${process.env.REACT_APP_API_URL}/wagemanage/adjustment_credits `, Data, {
         headers: {
           Authorization: `Token ${localStorage.getItem('token')}`,
         },
       })
       .then((res) => {
         if (res.status) {
           props.showModal(false)
           setLabourerId("")
           setSiteid("")
         } 
       })
       .catch((error) => {
         console.log(error)
       });
  };

  

  const viewHandler = ()=>{
    setShow(true)
  }

  const labourHandler = ()=>{
      setShowLabour(true)
  }

  return (
    <>
      <Modal
        show={props.modal}
        onHide={() =>{
        props.showModal(false)
        setLabourerId("")
           setSiteid("")
        }
        } 
      >
        <SiteModal 
        query={props.query}
        sites={sites} 
        show={show} 
        setShow={setShow}
        setSiteid={setSiteid}/>
        <LabourModal
        showLabour={showLabour}
        setShowLabour={setShowLabour}
        setLabourerId={setLabourerId}
        />
        <Modal.Header closeButton>
          <Modal.Title>Create New Adjustment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
              <Form.Group as={Col} controlId="siteid">
                <Form.Label>Site</Form.Label>
                <div style={{display:"flex"}}>
                  <div>
                <Form.Control style={{width:'300px'}}
                  type="text"
                  name="siteid"
                  disabled={true}
                  value={siteid}
                  ref={register({
                    required: true,
                  })}
                >    
                </Form.Control>
                {errors.siteDetail?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}   
                </div>
                <div>
                <Button style={{backgroundColor:'navy'}} onClick={(e)=>viewHandler()}>View</Button></div>
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="labourer_id" >
              <Form.Label>Labourer ID</Form.Label>
              <div style={{display:"flex"}}>
                  <div>
               
                <Form.Control style={{width:'300px'}}
                type="text"
                name="labourer_id"
                disabled={true}
                value={labourerId}
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
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="adjustment_amount" >
                <Form.Label>Adjustment Amount</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter Amount"
                name="adjustment_amount"
                ref={register({
                  required: true,
                })}/>
                {errors.adjustmetn_amount?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>    
            </Form.Row>
            <Button variant="primary" type="submit">
              Submit
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

export default  connect(mapStateToProps)(CreateAdjustment);
