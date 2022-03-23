import React, { useEffect,useState } from 'react';
import { Button } from 'react-bootstrap';
import * as MdIcons from 'react-icons/md';
import ConcreteList from './ConcreteList'
import AddNewConcrete from './AddNewConcrete';
import axios from 'axios'


const Concrete = () => {

  const [show,setShow] = useState(false)
  const [concrete,setConcrete] = useState([])



  const viewHandler = (e)=>{
    setShow(true)
  }

  useEffect(()=>{

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretesection/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      ).then((res)=>{
        if(res.status === 200)
        {
          setConcrete(res.data)
        }
        else{
          alert("Cannot Retrieve Concrete")
        }
      })
      .catch((err)=>console.log(err))
  },[])

    const revalidate = ()=>{
      axios
      .get(
        `${process.env.REACT_APP_API_URL}/SalaryStrutManage/create_concretesection/ `,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      ).then((res)=>{
        if(res.status === 200)
        {
          setConcrete(res.data)
        }
        else{
          alert("Cannot Retrieve Concrete")
        }
      })
      .catch((err)=>console.log(err))
    }

  return (
    <>
      <div className="subSectionContainer">
        <div className="title">
          <span>Concrete</span>
          <hr className="seperationLine" />
        </div>
        <div className="subContent">
          <div className="subContentHeader">
            <span className="contentTitle">
              Concrete
            </span>
            <span>
              <Button
                className="btn btn-sm"
                onClick={(e)=>viewHandler(e)}
              >
                <MdIcons.MdAddToPhotos />
                Create Concrete 
              </Button>
            </span>
          </div>
          <hr className="seperationLine" />
          <ConcreteList concrete={concrete} revalidate={revalidate}/>
         </div>
         </div>
         <AddNewConcrete show={show} setShow={setShow} revalidate={revalidate}/>
    </>
  );
};


export default Concrete;
