import React, {useState, useEffect} from 'react';
import MultipleChoice from "../components/MultipleChoice"
import ShortAnswer from '../components/ShortAnswer';
import {v4 as uuid} from 'uuid';
import { Redirect } from 'react-router';
import Navbar from '../components/Navbar'

export const Form = ({match}) => {
  let d = new Date();
  let n = d.getHours();
  if (n > 20) {
    document.documentElement.className = "dark-bg"
  } else if (n < 4) {
    document.documentElement.className = "dark-bg"
  } else if (n > 4) {
    document.documentElement.className = "white-bg"
  }
  
  const checkLoggedIn = () => {
    if (!localStorage.getItem('user')) {
      
      return <Redirect to={`/?redirectform=${match.params.id}`} />
  } else {
    return <Navbar />
  }}

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('user') != null) {
        const user = await fetch(`/api/user?id=${JSON.parse(localStorage.getItem('user'))._id}`, {
          method: "GET"
        })
        const data = await user.json()
        localStorage.setItem('user', JSON.stringify(data))
      }
    }
    fetchData()
  }, [])

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formAnswers, setFormAnswers] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem('user')) {
        const res = await fetch(`/api/forms?id=${match.params.id}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error)
          setLoading(false)
        } else {
          setForm(data)
          const res2 = await fetch(`/api/formanswers?userId=${JSON.parse(localStorage.getItem('user'))._id}&id=${match.params.id}`)
          const data2 = await res2.json()
          
          setFormAnswers(data2)
          setLoading(false);
        }
        
      }
      
    }
    fetchData()
    }, [match]);

  return (
    
  <div className = "wrapper">
    {checkLoggedIn()}
    
    {error? <h1 style={{color: 'red', textAlign:'center'}}>{error} error</h1> : loading ? <h1>Loading...</h1> : <h1 style={{textAlign: 'center'}}>{form.title} by {form.author}</h1>}
    <div className = "content">
      {error? error === 404 ? <p>That form was not found. Please try again.</p> : <p>There was an unknown error. Please try again later.</p> : loading ? <p>Loading...</p> : form.questions.map(v => {
        if (v.type === "multiple-choice") {
          return <MultipleChoice key = {uuid()} question = {v.question} responses = {v.answers} user_answers = {formAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
        }
        if (v.type === "short-answer") {
          return <ShortAnswer key = {uuid()} question = {v.question} user_answers = {formAnswers} id = {match.params.id} correct_answers = {v.correct_answers || ''}/>
        }
      })}
    </div>
  </div>)
  
}