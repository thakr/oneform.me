import React, {useState, useEffect} from 'react';
import MultipleChoice from "../components/MultipleChoice"
import ShortAnswer from '../components/ShortAnswer';
import {v4 as uuid} from 'uuid';
import { Redirect,useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Loader from "react-loader-spinner";

export const Form = ({match, history}) => {
  let d = new Date();
  let n = d.getHours();
  if (n > 18) {
    document.documentElement.className = "dark-bg"
  } else if (n < 4) {
    document.documentElement.className = "dark-bg"
  } else if (n > 4) {
    document.documentElement.className = "white-bg"
  }

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formAnswers, setFormAnswers] = useState(null)
  const [error, setError] = useState(false)
  const [viewUserAnswers, setViewUserAnswers] = useState(false)
  const [userFormAnswers, setUserFormAnswers] = useState(null)
  const [viewingUser, setViewingUser] = useState('')
  const [loadingResponse, setLoadingResponse] = useState(false)
  const query = new URLSearchParams(useLocation().search)
  const userAnswers = query.get("userAnswers")
  let apiprefix = ""
  process.env.NODE_ENV === "development" ? apiprefix = "http://localhost:8080/api" : apiprefix = "/api";
  useEffect(() => {

    if (form) {
      if (userAnswers && JSON.parse(localStorage.getItem('user'))._id === form.authorid) {
        setViewUserAnswers(true);
        async function fetchData() {
          const res2 = await fetch(`${apiprefix}/formanswers?userId=${userAnswers}&id=${match.params.id}`)
          const data2 = await res2.json()
          setUserFormAnswers(data2)
        }
        fetchData().then(() => { setLoadingResponse(false)})
        
      } else {
        setViewUserAnswers(false)
      }
    }
    
  }, [match])
  

  const checkLoggedIn = () => {
    if (!localStorage.getItem('user')) {
      
      return <Redirect to={`/login?redirectform=${match.params.id}`} />
  } else {
    return <Navbar />
  }}

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('user') != null) {
        const user = await fetch(`${apiprefix}/user?id=${JSON.parse(localStorage.getItem('user'))._id}`, {
          method: "GET"
        })
        const data = await user.json()
        localStorage.setItem('user', JSON.stringify(data))
      }
    }
    fetchData()
  }, [])

  
  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('user')) {
        const res = await fetch(`${apiprefix}/forms?id=${match.params.id}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error)
          setLoading(false)
        } else {
          setForm(data)

          if (JSON.parse(localStorage.getItem('user'))._id !== data.authorid) {
            const res2 = await fetch(`${apiprefix}/formanswers?userId=${JSON.parse(localStorage.getItem('user'))._id}&id=${match.params.id}`)
            const data2 = await res2.json()
            
            setFormAnswers(data2)
          }
          
          setLoading(false);
        }
        
      }
      
    }
    fetchData()
    }, [match]);

    const viewResponses = (ua,un) => {
      
      history.push(`/form/${match.params.id}?userAnswers=${ua}`)
      setLoadingResponse(true)
      setViewingUser(un)
    }
    console.log(loading)
  return (
    
  <div className = "wrapper">
    {checkLoggedIn()}
    {error? <h1 style={{color: 'red', textAlign:'center'}}>{error} error</h1> : loading ? <h1> </h1> : !viewUserAnswers? <h1 style={{textAlign: 'center'}}>{form.title} by {form.author}</h1> : <h1 style={{textAlign: 'center'}}>{viewingUser}'s responses</h1>}
    <div className = "content">
      {error? error === 404 ? <p>That form was not found. Please try again.</p> : <p>There was an unknown error. Please try again later.</p> : loading || loadingResponse ? 
      <div className = "loader"><Loader
        type="TailSpin"
        color="#00BFFF"
        height={50}
        width={50}
      /></div> : JSON.parse(localStorage.getItem('user'))._id !== form.authorid ? form.questions.map(v => {
        if (v.type === "multiple-choice") {
          return <MultipleChoice deactive={false} key = {uuid()} question = {v.question} responses = {v.answers} user_answers = {formAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
        }
        if (v.type === "short-answer") {
          return <ShortAnswer deactive={false}key = {uuid()} question = {v.question} user_answers = {formAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
        }
      }) : !viewUserAnswers ? form.usersAnswered.length < 1 ? <p>Nobody has submitted anything on your form yet. Go share it!</p> : form.usersAnswered.map(v => {
        console.log(v)
          return <div key={v.id} className="view-responses-item"><p>{v.name} ({v.email})</p><button className="view-answers-btn" onClick={() => viewResponses(v.id, v.name)}>View response</button></div>
        }): !loadingResponse &&
        form.questions.map(v => {
          if (v.type === "multiple-choice") {
            return <MultipleChoice deactive={true} key = {uuid()} question = {v.question} responses = {v.answers} user_answers = {userFormAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
          }
          if (v.type === "short-answer") {
            
            return <ShortAnswer deactive={true} key = {uuid()} question = {v.question} user_answers = {userFormAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
          }
        })}
    </div>
  </div>)
  
}