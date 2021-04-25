import React, {useState, useEffect} from 'react'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import './App.css';
import {Home} from "./routes/Home"
import {Login} from "./routes/Login"
import {Form} from "./routes/Form"
import {NotFound} from "./routes/NotFound"
import {Dashboard} from "./routes/Dashboard"
import {Create} from "./routes/Create"
import {MyForms} from './routes/MyForms'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('user')) {
        const user = await fetch(`/api/user?email=${JSON.parse(localStorage.getItem('user')).email}`, {
          method: "GET"
        })
        const data = await user.json()
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      }
      
    }
    fetchData()
  }, [])
  return (
    <div className="App">
      <BrowserRouter>
        <Switch> 
          <Route path='/' exact> <Home/></Route>
          <Route path='/login' exact>{ localStorage.getItem('user') != null ? <Redirect to = "/dashboard"/> : <Login/>}</Route>
          <Route path='/dashboard' exact><Dashboard/></Route>
          <Route path='/form/:id' exact component={Form}></Route>
          <Route path='/create' exact>{ localStorage.getItem('user') == null ? <Redirect to = "/"/> : <Create/>}</Route>
          <Route path="/my-forms" exact component = {MyForms}></Route>
          <Route path='/logout' exact>{localStorage.getItem('user') ? () => {
            localStorage.removeItem('user');
            window.location.replace('/')
            } : <Redirect to="/"/>}</Route>
          <Route path='/' component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
