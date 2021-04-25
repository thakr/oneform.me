import { useState, useEffect } from "react";
import {v4 as uuid} from 'uuid';

const MultipleChoice = ({deactive,question,responses,user_answers,id, correct_answers}) =>{ //answers
  const userId = JSON.parse(localStorage.getItem('user'))._id
  const [formData, setFormData] = useState({'question': question, 'data': '', 'userId': userId, 'id': id})
  const [formDisabled, setFormDisabled] = useState(false)
  const [submitting, setSubmitting] = useState("Submit")
  const [correct, setCorrect] = useState('')
  let apiprefix = ""
  process.env.NODE_ENV === "development" ? apiprefix = "http://localhost:8080/api" : apiprefix = "/api";
  useEffect(() => {
    for (let i=0; i < user_answers.responses.length; i++) {
      if (user_answers.responses[i].question === question) {
        setFormData({'data': user_answers.responses[i].answer})
        if (correct_answers) {
          let isCorrect = false
          for (let j = 0; j < correct_answers.length; j++) {
            if (user_answers.responses[i].answer === correct_answers[j]) {
              isCorrect = true
            }
          }
          if (isCorrect === true) {
            setCorrect('-correct')
          } else {
            setCorrect('-incorrect')
          }
        }
        setFormDisabled(true)
        setSubmitting("Submitted")
      }
    }
  }, [question, user_answers, correct_answers])

  const handleChange = event => {
    setFormData({...formData,'data': event.target.value})
  }
  const handleSubmit = event => {
    event.preventDefault();
    if (formDisabled !== true && deactive !== true) {
      setSubmitting("Submitting...")
  
      if (formData.data !== '') {
        fetch(`${apiprefix}/send-answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(formData)
        })
        .then(function(res) {
          if (correct_answers) {
            let isCorrect = false
            for (let i = 0; i < correct_answers.length; i++) {
              if (formData.data === correct_answers[i]) {
                isCorrect = true
              }
            }
            if (isCorrect === true) {
              setCorrect('-correct')
            } else {
              setCorrect('-incorrect')
            }
          }
          setFormDisabled(true)
          setSubmitting("Submitted")
        })
        .catch(function(err) {
          console.log(err)
        })
      } else {
        alert('please enter a response!')
        setSubmitting('Submit')
      }
    }
  }
  return (
    <div className = {`multiple-choice${correct}`}>
      <h2>{question} </h2>
      <form onSubmit={handleSubmit}>
        {responses.map(res => (
          
          <div key = {uuid()} className="response">
            <input type="radio" name = "response" id = {res} value={res} onChange={handleChange} checked = {formData.data === res} disabled = {deactive || formDisabled}/>
            <label htmlFor={res}>{res}</label>
          </div>
        ))}
        <input className = "submit" type ="submit" value = {submitting} disabled = {deactive || formDisabled}/>
      </form>
    </div>
  )
}

export default MultipleChoice