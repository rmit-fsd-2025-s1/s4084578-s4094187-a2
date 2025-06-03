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
    </div>
  );
};

export default Header;
