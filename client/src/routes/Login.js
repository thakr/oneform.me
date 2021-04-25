import React, { useEffect, useState } from 'react';
import {GoogleLogin} from "react-google-login"
import {Redirect, useLocation} from 'react-router-dom'

export const Login = (props) => {
  console.log(process.env.NODE_ENV)
  const [user, setUser] = useState(null)
  document.documentElement.className = "white-bg"
  let query = new URLSearchParams(useLocation().search)
  let redirect = query.get("redirectform")
  if (redirect == null) {
    redirect = ''
  }
  
  const handleLogin = async googleData => {
    let apiprefix = ""
    process.env.NODE_ENV === "development" ? apiprefix = "http://localhost:8080/api" : apiprefix = "/api";
    const res = await fetch(`${apiprefix}/auth/google`, {
      
        method: "POST",
        body: JSON.stringify({
        token: googleData.tokenId,
        redirect: redirect
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    
    
    if (data.redirect !== '') {
      const redirecturl = data.redirect
      delete data.redirect
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      window.location.replace(`/form/${redirecturl}`)

    } else {
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
    }
    
  }
  //get latest user
  
  return (
    <>
      <h1>Login</h1>
      {user != null? <Redirect to="/dashboard"/>: <GoogleLogin
        clientId="762756412506-3pojiov2mcf6sosr44qna6oqorr7ntc9.apps.googleusercontent.com"
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleLogin}
        cookiePolicy={'single_host_origin'}
      />}
      
    </>
  )
}