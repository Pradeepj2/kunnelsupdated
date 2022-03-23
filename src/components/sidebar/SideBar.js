import React, { useRef,useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as HiIcons from 'react-icons/hi';
import * as ImIcons from 'react-icons/im';
import * as RiIcons from 'react-icons/ri';
import { AiFillCalendar } from 'react-icons/ai';
import { AiFillSetting } from 'react-icons/ai'
import { NavLink } from 'react-router-dom';
import KunnelLogoColor from '../../images/KunnelLogoColor.png';
import './Sidebar.css';

const SidebarData = [
  {
    title: 'Site Management',
    path: '/sitemanage',
    icon: <RiIcons.RiBuildingFill />,
    name: 'nav-text',
  },
  {
    title: 'User Management',
    path: '/usermanage',
    icon: <FaIcons.FaUsersCog />,
    name: 'nav-text',
  },
  {
    title: 'Labour Management',
    path: '/labourmanage',
    icon: <ImIcons.ImUsers />,
    name: 'nav-text',
  },
  {
    title: 'Attendance',
    path: '/attendance',
    icon: <GoIcons.GoChecklist />,
    name: 'nav-text',
  },
  {
    title: 'Salary Management',
    path: '/salarymanage',
    icon: <FaIcons.FaMoneyBillWave />,
    name: 'nav-text',
  },
  {
    title: 'Labour Benefits',
    path: '/benefits',
    icon: <GiIcons.GiReceiveMoney />,
    name: 'nav-text',
  },
  // {
  //   title: 'Finance',
  //   path: '/finance',
  //   icon: <MdIcons.MdWork />,
  //   name: 'nav-text',
  // },
  {
    title: 'Labour OT',
    path: '/labourot',
    icon: <RiIcons.RiBuildingFill />,
    name: 'nav-text',
  },
  // {
  //   title: 'Reports',
  //   path: '/reports',
  //   icon: <HiIcons.HiDocumentDownload />,
  //   name: 'nav-text',
  // },
  // {
  //   title: 'Approvals',
  //   path: '/approvals',
  //   icon: <FaIcons.FaCheckSquare />,
  //   name: 'nav-text',
  // },
  {
    title: 'Concrete',
    path: '/concrete',
    icon: <GiIcons.GiConcreteBag />,
    name: 'nav-text',
  },
  {
    title: 'Holidays',
    path:'/holidays',
    icon: <AiFillCalendar/>,
    name:'nav-text',
  },
  {
    title:'Settings',
    path:'/setting',
    icon:<AiFillSetting/>,
    name:'nav-text'
  }
];





const SideBar = () => {
  const menuRef = useRef(null);
  const [display,setDisplay] = useState("block")
  var finalData = [];

  const handleToggle = (menuRef) => {
    menuRef.current.style.display = display
    if(display === "none")
    {
      setDisplay("block")
    }
    else{
      setDisplay("none")
    }
  };


var role = localStorage.getItem('role')
var userType = localStorage.getItem('userType')
if(role === 'Finance')
{
  finalData = SidebarData.filter((obj)=>obj.title!=="User Management"&& obj.title!=="Labour OT")
}
else if(role === "OperationDept")
{
if(userType === "ProjectManager")
{
  finalData = SidebarData.filter((obj)=> obj.title === "Approvals" || obj.title === "Attendance")
}
if(userType === 'SiteEngineer')
{
  finalData = SidebarData.filter((obj)=>obj.title === "Approvals"|| obj.title==="Concrete")
}
if(userType === 'SiteAssitant')
{
  finalData = SidebarData.filter((obj)=>obj.title === "Attendance"|| obj.title==="Concrete" || obj.title ==="Labour Management" || obj.title === "Concrete" || obj.title === "Holidays" || obj.title === "Labour OT")
}
}
else 
{
  finalData = [{
    title: 'Labour Management',
    path: '/labourmanage',
    icon: <ImIcons.ImUsers />,
    name: 'nav-text',
  }]
}
if(role === "admin")
{
  finalData = SidebarData
}



//console logs for testing purpose

//console.log(userType,"user type")

  return (
    <div className="navBar">
      <div className="company">
        <span>
          <img className="logo" src={KunnelLogoColor} alt="companyLogo" />
        </span>
        <span>
          <b className="name">KUNNEL</b>
        </span>
        <span className="toggleIcon" onClick={() => handleToggle(menuRef)}>
          <RiIcons.RiMenuLine />
        </span>
      </div>
      <div className="menu" ref={menuRef} >
        <ul className="menuItems" style={{color:'white',backgroundColor:"navy", marginTop:'5%'}}>
          {finalData.map((item, index) => {
            return (
              <li key={index} className={item.name} >
                <NavLink to={item.path} activeClassName="side-bar-active">
                  {item.icon}
                  <span className="navTitles" >{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
