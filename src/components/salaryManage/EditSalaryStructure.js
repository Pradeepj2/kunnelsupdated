import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { edit_salary_struct_modal } from '../../redux/actions/fetchActions';
import SiteModal from '../utilModals/siteModal'

const EditSalaryStructure = ({
  edit_salary_struct_modal,
  editSalaryStructureModal,
  sites,
  salaryCodeEdit,
  salaryCodes,
}) => {
  const { register, handleSubmit, errors} = useForm({
    mode: 'onTouched',
  });

  ///########################declaring states######################//
//const [dailyRate,setDailyRate] = useState();
const [basicPay,setBasicPay] = useState(salaryCodeEdit.basic_pay);
const [dailyAllowance,setDailyAllowance] = useState(salaryCodeEdit.daily_allowence)
const [category, setCategory] = useState(salaryCodeEdit.labourer_class)
const [designation,setDesignation] = useState([])
const [total,setTotal] = useState("")
const [show, setShow] = useState(false)
const [siteid, setSiteid] = useState(salaryCodeEdit.Site)

useEffect(()=>{
  setSiteid(salaryCodeEdit.Site)
  setTotal(salaryCodeEdit.daily_rate)
  setCategory(salaryCodeEdit.labourer_class)
},[salaryCodeEdit])


useEffect(()=>{
  axios.get(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_class/`,{
    headers:{
      Authorization:`Token ${localStorage.getItem('token')}`
    }
  }).then((res)=>{
    setDesignation(res.data)
  },[designation])
})


  const dailyRateCalculation = ()=>{
    if(basicPay && !dailyAllowance)
    {
        return Number(basicPay) + Number(salaryCodeEdit.daily_allowence)
    } 
    if(!basicPay && dailyAllowance)
    {
      return Number(dailyAllowance) + Number(salaryCodeEdit.basic_pay) 
    }
    if(basicPay && dailyAllowance)
    {
      return Number(dailyAllowance) + Number(basicPay)
    }

     return  +salaryCodeEdit.basic_pay+ +salaryCodeEdit.daily_allowence
    
  }
 
 

  const onSubmit = (data) => {
  
    const formData = new FormData();

    formData.append('id', salaryCodeEdit.id);
    formData.append('labourer_class', data.designation);
    formData.append('labourer_category', data.labourer_category);
    formData.append('gender', data.gender);
    formData.append('Skill_set', data.Skill_set);
    formData.append('Grade',data.Grade);
    formData.append('daily_rate',dailyRateCalculation());
    formData.append('basic_pay',data.basic_pay);
    formData.append('daily_allowence', data.daily_allowence)
    formData.append('Site',siteid);
    formData.append('OTrate', data.OTrate);
    formData.append('sunday_wage', data.sunday_wage);
    formData.append('SW_C1',data.SW_C1);
    formData.append('SW_C2',data.SW_C2);
    formData.append('holiday_wage',data.holiday_wage);
    formData.append('OTtype', (category==="Union")?"double":"fixed" );
    formData.append('rentation',data.rentation);
    formData.append('rent', data.rent_amount);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode/edit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          edit_salary_struct_modal({ show: false, data: [] });
          alert(res.data.messgae);
          window.location.reload();
        } else {
          alert(res.data.messgae);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const deleteSalaryHandler = ()=>{

    const form  = new FormData();

    form.append('id',salaryCodeEdit.id)

    axios.post(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/salarycode/delete/ `,form,{
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  })
  .then((res)=>{
    alert(res.data.Message.charAt(0).toUpperCase() + res.data.Message.slice(1))
    if(res.data.status)
      window.location.reload()
  }).catch((err)=>console.log(err))
  }

  const viewHandler = ()=>{
    setShow(true)
  }

  

  return (
    <>
      <Modal
        show={editSalaryStructureModal}
        onHide={() =>{
          edit_salary_struct_modal({ show: false, data: [] })
         // setDailyRate(null)
          setBasicPay(null)
          setDailyAllowance(null)
          setCategory("")
          setSiteid("")
        }
        }
      >
       <SiteModal 
       // query={props.query}
        sites={sites} 
        show={show} 
        setShow={setShow}
        setSiteid={setSiteid}/>
        <Modal.Header closeButton>
          <Modal.Title>Edit Wage Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Row>
            <Form.Group as={Col} controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="designation"
                  defaultValue={salaryCodeEdit.labourer_class}
                  ref={register({
                    required: true,
                  })}
                >
                  {designation.map((obj)=>{
                    return(
                      <option value={obj.laboourerclass} key={obj.id} >{obj.laboourerclass}</option>
                    )
                  })}
                 
                </Form.Control>
                {errors.gender?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labour Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  defaultValue={salaryCodeEdit.labourer_category}
                  ref={register({
                    required: true,
                  })}
                  onChange={(e)=>{
                    setCategory(e.target.value)
                  }}
                >  
                  <option value="">Choose...</option>
                  <option value="Kunnel" key="1">
                    Kunnel
                  </option>
                  <option value="Casual" key="2">
                    Casual
                  </option>
                  <option value="Union" key="3">
                    Union
                  </option>
                </Form.Control>
                {errors.labourer_category?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* <Form.Group as={Col} controlId="labourer_category">
                <Form.Label>Labour Category</Form.Label>
                <Form.Control
                  as="select"
                  name="labourer_category"
                  defaultValue={salaryCodeEdit.labourer_category}
                  ref={register({
                    required: true,
                  })}
                > */}
                  {/* <option value="">Choose...</option>
                  <option value="Hindi labour" key="4">
                    Hindi Labour
                  </option>
                  <option value="Malayalee Labour" key="5">
                    Malayalee Labour
                  </option>
                  <option value="Union Labour" key="6">
                    Union Labour
                  </option>
                  <option value="Tamil Labour" key="7">
                    Tamil Labour
                  </option>
                  <option value="Operator" key="8">
                    Operator
                  </option>
                  <option value="Town crane Driver / Skilled operator" key="9">
                    Tower Crane Driver / Skilled operator
                  </option>
                  <option value="Bobcat Driver" key="10">
                    Bobcat Driver
                  </option>
                  <option value="Batching Plant Operator" key="11">
                    Batching Plant Operator
                  </option>
                  <option value="Foreman" key="12">
                    Foreman
                  </option>
                </Form.Control> */}
                {/* {errors.labourer_category?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              <Form.Group as={Col} controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  defaultValue={salaryCodeEdit.gender}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Female" key="13">
                    Female
                  </option>
                  <option value="Male" key="14">
                    Male
                  </option>
                </Form.Control>
                {errors.gender?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="Skill_set">
                <Form.Label>Skill Type</Form.Label>
                <Form.Control
                  as="select"
                  name="Skill_set"
                  defaultValue={salaryCodeEdit.Skill_set}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="Skilled" key="15">
                    Skilled
                  </option>
                  <option value="Unskilled" key="16">
                    Unskilled
                  </option>
                  {/* <option value="Semiskilled" key="17">
                    Semiskilled
                  </option>
                  <option value="Foreman" key="18">
                    Foreman
                  </option> */}
                </Form.Control>
                {errors.Skill_set?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="Grade">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  as="select"
                  name="Grade"
                  defaultValue={salaryCodeEdit.Grade}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="">Choose...</option>
                  <option value="1" key="19">
                    1
                  </option>
                  <option value="2" key="20">
                    2
                  </option>
                  <option value="3" key="21">
                    3
                  </option>
                  <option value="4" key="22">
                    4
                  </option>
                  <option value="5" key="23">
                    5
                  </option>
                  <option value="6" key="24">
                    6
                  </option>
                  <option value="7" key="25">
                    7
                  </option>
                  <option value="8" key="26">
                    8
                  </option>
                  <option value="9" key="27">
                    9
                  </option>
                  <option value="10" key="28">
                    10
                  </option>
                </Form.Control>
                {errors.Grade?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="daily_rate">
                <Form.Label>Daily Rate</Form.Label>
                <Form.Control
                  type="text"
                  //placeholder="Enter the amount"
                  //placeholder={salaryCodeEdit.daily_rate}
                  disabled={true}
                  //value={(basicPay && dailyAllowance)?(parseInt(basicPay)+parseInt(dailyAllowance)):'0'}
                  value={dailyRateCalculation()}
                  name="daily_rate"
                  //defaultValue={salaryCodeEdit.daily_rate}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.daily_rate?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="basic_pay">
                <Form.Label>Basic Pay</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the amount"
                  name="basic_pay"
                  defaultValue={salaryCodeEdit.basic_pay}
                  ref={register({
                    required: true,
                  })}
                  onChange = {(e)=>{
                    setBasicPay(e.target.value)
                  }}
                />
                {errors.basic_pay?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="daily_allowence">
                <Form.Label>Daily Allowance</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the amount"
                  name="daily_allowence"
                  defaultValue={salaryCodeEdit.daily_allowence}
                  ref={register({
                    required: true,
                  })}
                  onChange={(e)=>{
                    setDailyAllowance(e.target.value)
                    
                    // setDailyRate(+dailyAllowance + +basicPay)
                    //console.log(dailyRate)
                  }}
                />
                {errors.daily_allowence?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="Site">
                <Form.Label>Site</Form.Label>
                <div  style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                <Form.Control style={{width:'200px'}}
                  type="text"
                  name="Site"
                  value={siteid}
                  disabled={true}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* <option key="0" value="">
                    Choose...
                  </option>
                  {!(sites.length === 0)
                    ? sites.map((site) => {
                        const { site_id } = site;
                        return (
                          <option key={sites.indexOf(site) + 1} value={site_id}>
                            {site_id}
                          </option>
                        );
                      })
                    : null} */}
                </Form.Control>
                {errors.Site?.type === 'required' && (
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
            <Form.Row>
              <Form.Group as={Col} controlId="OTrate">
                <Form.Label>OT Rate</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OT rate"
                  name="OTrate"
                  defaultValue={salaryCodeEdit.OTrate}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.OTrate?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {/* {(category==="Union"||salaryCodeEdit.labourer_class==="Union")?(<> */}
                {(true)?(<>
              {/* <Form.Group as={Col} controlId="sunday_wage">
                <Form.Label>Sunday Wage</Form.Label>
                <Form.Control
                  type="text"
                  name="sunday_wage"
                  defaultValue={salaryCodeEdit.sunday_wage}
                  ref={register({
                    required: true,
                  })}
                 > */}
                   {/* <option value="">Choose...</option>
                 <option value="true" key="29">
                   true
                 </option>
                 <option value="false" key="30">
                   false
                 </option> */}
              {/* </Form.Control>{errors.sunday_wage?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
                <Form.Group as={Col} controlId="holiday_wage">
                <Form.Label>Holiday Wage</Form.Label>
                <Form.Control
                  type="text"
                  name="holiday_wage"
                  defaultValue={salaryCodeEdit.holiday_wage}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* <option value="">Choose...</option>
                  <option value="true" key="31">
                    true
                  </option>
                  <option value="false" key="32">
                    false
                  </option> */}
                </Form.Control>{errors.holiday_wage?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              </>
             ):null}
            
            </Form.Row>
            <Form.Row>
              {(category==="Union")?(<>
                <Form.Group as={Col} controlId="SW_C1">
                <Form.Label>SW-C1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="SW_C1"
                  defaultValue={salaryCodeEdit.SW_C1}
                  ref={register({
                    required: true,
                  })}
                />
                 {errors.SW_C1?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} controlId="SW_C2">
                <Form.Label>SW-C2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="SW_C2"
                  defaultValue={salaryCodeEdit.SW_C2}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.SW_C2?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              </>):null}
              {/* <Form.Group as={Col} controlId="OTtype">
                <Form.Label>OT Type</Form.Label>
                <Form.Control
                  as="select"
                  disabled={true}
                  value={(category==="Union")?"double":"fixed"}
                  name="OTtype"
                  defaultValue={salaryCodeEdit.OTtype}
                  ref={register({
                    required: true,
                  })}
                > */}
                  {/* <option value="">Choose...</option>
                  <option value="Fixed" key="33">
                    Fixed
                  </option>
                  <option value="Double" key="34">
                    Double
                  </option>
                </Form.Control> */}
                {/* {errors.OTtype?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
              {/* <Form.Group as={Col} controlId="compenratio">
                <Form.Label>Compensation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter here"
                  name="compenratio"
                  defaultValue={salaryCodeEdit.compenratio}
                  ref={register({
                    required: true,
                  })}
                /> */}
                {/* {errors.compenratio?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group> */}
            </Form.Row>
            <Form.Row>
              
              
            </Form.Row> 
            <Form.Row>
            <Form.Group as={Col} controlId="rent_amount">
                <Form.Label>Rent Amount</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={salaryCodeEdit.rent}
                  name="rent_amount"
                  ref={register({
                    required: true,
                  })}
                />
                {errors.compenratio?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>
              {(category==="Kunnel")?( <Form.Group as={Col} controlId="rentation">
                <Form.Label>Retension</Form.Label>
                <Form.Control
                  type="text"
                  name="rentation"
                  defaultValue={salaryCodeEdit.rentation}
                  ref={register({
                    required: true,
                  })}
                >
                  {/* <option value="">Choose...</option>
                  <option value="true" key="35">
                    true
                  </option>
                  <option value="false" key="36">
                    false
                  </option> */}
                </Form.Control>
                {errors.rentation?.type === 'required' && (
                  <p className="text-danger">
                    <small>
                      <i>This field is required</i>
                    </small>
                  </p>
                )}
              </Form.Group>):null}
             
            </Form.Row> 
            <Button variant="primary" type="submit">
              Save Salary
            </Button>
          
          </Form>
          <Button type="delete" style={{backgroundColor:'red',border:'red', marginTop:'20px'}} onClick={(e)=>deleteSalaryHandler(e)}>Delete Salary</Button>  
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({
  editSalaryStructureModal: state.editSalaryStructureModal,
  sites: state.sites,
  salaryCodes: state.salaryCodes,
  salaryCodeEdit: state.salaryCodeEdit,
});
export default connect(mapStateToProps, { edit_salary_struct_modal })(
  EditSalaryStructure
);
