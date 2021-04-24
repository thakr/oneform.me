import React from 'react';
import {Redirect} from 'react-router-dom'
import Navbar from '../components/Navbar.js'

export const Dashboard = () => {
  let d = new Date();
  let n = d.getHours();
  if (n > 20) {
    document.documentElement.className = "night-theme"
  } else if (n < 4) {
    document.documentElement.className = "night-theme"
  } else if (n > 4) {
    document.documentElement.className = "day-theme"
  }
  
  //get latest user
 
  return (
    
    <>
    {!localStorage.getItem('user') ? <Redirect to="/"/> : 
    <>
    <Navbar />
    <div className="dashboard-wrapper">
      
      <h1>Hey, {JSON.parse(localStorage.getItem('user')).name}!</h1>
      <p>Create a form or fill one out.</p>
    </div>
    </>
    }
    </>
   
  )
}