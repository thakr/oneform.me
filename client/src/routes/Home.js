import React, { useEffect, useState } from 'react';
import {GoogleLogin} from "react-google-login"
import {Redirect, useLocation} from 'react-router-dom'

export const Home = (props) => {

  return (
    <>
      <h1>Landing page</h1>
      <Redirect to="/login" />
      
    </>
  )
}