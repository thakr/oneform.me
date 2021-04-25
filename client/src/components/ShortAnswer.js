import { useEffect, useState } from "react";

const ShortAnswer = ({deactive,question, user_answers, id, correct_answers}) =>{ 
  const userId = JSON.parse(localStorage.getItem('user'))._id
  const [formData, setFormData] = useState({'question': question, 'data': '', 'userId': userId, 'id': id})
  const [formDisabled, setFormDisabled] = useState(false)
  const [submitting, setSubmitting] = useState("Submit")
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState('')

  useEffect(() => {
    for (let i=0; i < user_answers.responses.length; i++) {
      if (user_answers.responses[i].question === question) {
        setAnswer(user_answers.responses[i].answer)
        if (correct_answers) {
          let isCorrect = false
          console.log(correct_answers)
          for (let i = 0; i < correct_answers.length; i++) {
            if (user_answers.responses[i].answer === correct_answers[i]) {
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
  }, [question, user_answers])

  const handleChange = event => {
    setFormData({...formData,'data': event.target.value})
  }
  const handleSubmit = event => {
    if (formDisabled !== true) {
      event.preventDefault();
      setSubmitting("Submitting...")
  
      if (formData.data !== '') {
        fetch('/api/send-answer', {
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
    <div className = {`short-answer${correct}`}>
      <h2>{question}</h2>
      <form onSubmit={handleSubmit}>
        <input value={answer? answer : formData.data} className = "short-answer-input" type="text" id="response" name="response" placeholder = "Enter response here" disabled={deactive || formDisabled} onChange={handleChange}/>
        <input className = "submit" type ="submit" value = {submitting} disabled={deactive || formDisabled}/>
      </form>
    </div>
  )
}

export default ShortAnswer