import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as MdIcons from 'react-icons/md';
import { useForm } from 'react-hook-form';


const Grade = () => {

    const [grade,setGrade] = useState("")

    const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

    const gradeHandler = ()=>{
         let Data = {
            grade:parseInt(grade)
        }
        axios.post(`${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_grade/`,Data,
        {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }
        )
        .then(res=>{
            if(res.data.status)
            {
                    alert("Grade Added")
                    setGrade("")             
            }
            else{
                //alert(res.data.Message)
                alert("Grade Already Exists")
            }
            
        })
    }


  return (

            <div>
          <Form className="mt-3" onSubmit={handleSubmit(gradeHandler)}>
            <Form.Group controlId="grade">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                type="number"
                name="grade"
                value={grade}
                placeholder="Enter Grade"
                onChange={(e)=>setGrade(e.target.value)}
                ref={register({
                  required: true,
                })}
              ></Form.Control>
            </Form.Group>
            {errors.grade?.type === 'required' && (
              <p className="text-danger">
                <small>
                  <i>Grade is required</i>
                </small>
              </p>
            )}
            <Button
              className="btn btn-sm"
              type="submit"
             // onClick={()=>designationHandler()}
            >
              <MdIcons.MdAddToPhotos />
              Create Grade
            </Button>
            </Form>
            </div>

  );
};

export default Grade;
