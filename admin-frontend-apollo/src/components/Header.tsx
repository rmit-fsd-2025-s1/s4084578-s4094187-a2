import { useRouter } from "next/router";
import React from "react";

function NavBarButton(props: {page: string, label:string}) {
  const router = useRouter();
  return <button className='navLink' onClick={() => router.push((props.page))}> {props.label} </button>
}

function NavBarLogout(props: {label:string}) {
  const router = useRouter();
  return <button 
    className='navLink' 
    onClick={(
    ) => {
      router.push(("/login"))
      // remove validation key upon logout
      localStorage.setItem("isAdmin", "false")
    }
  }> {props.label} </button>
}

const Header = () => {
  return (
    <div className='header'>
      <NavBarButton label='Admin Homepage' page='/'/>
      <NavBarButton label='Candidate Management' page='/candidates'/>
      <NavBarButton label='Course Management' page='/courses'/>
      <NavBarButton label='Lecturer Management' page='/lecturers'/>
      <NavBarButton label='Reports' page='/reports'/>
      {/* differnt component */}
      <NavBarLogout label='Logout'/>
    </div>
  );
};

export default Header;
