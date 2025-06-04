import { useRouter } from "next/router";
import React from "react";

function NavBarButton(props: {page: string, label:string}) {
  const router = useRouter();
  return <button className='navLink' onClick={() => router.push(
    (props.page)
  )}>{props.label}</button>;
}

const Header = () => {
  return (
    <div className='header'>
      <NavBarButton label='Admin Homepage' page='/'/>
      <NavBarButton label='Candidate Management' page='/candidates'/>
      <NavBarButton label='Course Management' page='/courses'/>
      <NavBarButton label='Lecturer Management' page='/lecturers'/>
      <NavBarButton label='Report: Chosen Candidates' page='/chosen_candidates'/>
      <NavBarButton label='Report: Popular Candidates' page='/popular_candidates'/>
      <NavBarButton label='Report: Unchosen Candidates' page='/unchosen_candidates'/>
    </div>
  );
};

export default Header;
