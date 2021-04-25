import React, {useState} from 'react'

export default function Navbar() {
  return (
    <nav>
      <div className="navbar-container">
        <h1><a href="/dashboard" id="navbar-title">oneform</a></h1>
        <div className="navbar">
          <NavItem img={false} text="Dashboard" link="/dashboard"/>
          <NavItem img={false} text="Create" link="/create"/>
          <NavItem img={JSON.parse(localStorage.getItem('user')).pictureUrl}>
            <DropdownMenu />
          </NavItem>       
        </div>
      </div>
      
    </nav>
  )
}
function NavItem(props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {props.img ? <img src={props.img} onClick={() => setOpen(!open)} alt="pfp"/> : <a className="navbar-link" href ={props.link}>{props.text}</a>}
      {open && props.children}
    </>
  )
}
function DropdownMenu() {
  return (
    <div className="dropdown">
      <a className="dropdown-item" href="/my-forms">My Forms</a>
      <a className = "dropdown-item" href="/logout">Logout</a>
    </div>
  )
}