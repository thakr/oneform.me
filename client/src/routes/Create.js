import React, {useState} from 'react'
import {v4 as uuid} from 'uuid';
import {Question} from '../components/Question'

export function Create() {
  document.documentElement.className = "img-bg"
  const [questions, setQuestions] = useState([{key: 1, type: '',question: '', correct_answers: [],}])
  const [title, setTitle] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorTxt, setErrorTxt] = useState('')

  const addQuestion = (event) => {
    event.preventDefault()
    setErrorTxt('')
    let newKey = questions[questions.length-1].key + 1
    setQuestions([...questions, {key: newKey}])
  }
  const formData = {}
  const handleSubmit = async (event) =>{
    event.preventDefault()
    //setSubmitText('Submitting...')
    let user = JSON.parse(localStorage.getItem('user'))
    console.log(user)
    if (user) {
      formData.title = title
      formData.user = user
      let newArr = [...questions]  //new arr without keys to send to server
      newArr.map((v) => {
        delete v.key
      })
      formData.questions = newArr
      const res = await fetch('/api/create-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setSubmitted(true)
      window.location.replace(`/form/${data.formId}`)
    } else {
      setErrorTxt('Invalid user')
    }
    
  } 
  


  const handleInputChange = (event) => {
    event.preventDefault()
    setTitle(event.target.value)
  }

  const getData = (data) => {
    const newArr = [...questions];
    newArr.map((v,i) => {
      if (data.key === v.key) {
        v.type = data.type;
        v.question = data.question;
        v.correct_answers = data.correct_answers;
        if (data.type === "multiple-choice") {
          v.answers = data.answers;
        } else {
          delete v.answers;
        }
        if (data.correct_answers.length === 0 || data.correct_answers[0] === "") {
          delete v.correct_answers
        }
      }
    })
    setQuestions(newArr)
  }

  const deleteQuestion = (key) => {
    let newArr = [...questions]
    newArr.map((v,i) => {
      if (v.key === key) {
        if (key !== 1) {
          newArr.splice(i,1)
        }
        else {
          setErrorTxt('You cannot delete the first question!')
        }
      }
    })
    setQuestions(newArr)
  }

  return (
    <div className="create-form-wrapper" >
      {!submitted? 
      <form autoComplete="off" onSubmit = {handleSubmit}>
        <input className = "create-form-title" type="text" onChange = {handleInputChange} placeholder="Form title" value={title} required/>
        <div className="create-form-questions-wrapper">
          {questions.map((v,i) => {
            return (
              <div>
                <Question deleteQuestion = {deleteQuestion} getData= {getData} key={v.key} num={v.key} />
                <p style={{color: 'red'}}>{errorTxt}</p>
              </div>
            )
          })}
          <button className = "create-form-button" onClick={addQuestion}>+</button>
        </div>
        <input className = "create-form-submit" type="submit" value="Create form"/>
      </form> :<p>Redirecting...</p>}
      
    </div>
  )
}
