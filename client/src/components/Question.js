import React, {useState, useEffect} from 'react'
import {v4 as uuid} from 'uuid';
import trash from '../images/trash.svg'

import { MathComponent } from 'mathjax-react'

export function Question({num, getData, deleteQuestion}) {
  const [type, setType] = useState('short-answer')
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState([''])
  const [correct, setCorrect] = useState([])
  const [correctVal, setCorrectVal] = useState([])
  const [errorTxt, setErrorTxt] = useState('')
  

  const mcData = {
    key: num,
    type: type,
    question: question,
    answers: responses,
    correct_answers: correctVal,
  }
  const saData = {
    key: num,
    type: type,
    question: question,
    correct_answers: correctVal,
  }
  useEffect(() => {
    if (type === "multiple-choice") {
      getData(mcData)
    } else {
      getData(saData)
    }
  }, [type,question,responses,correctVal])

  useEffect(() => {
    const newArr = [...correctVal]
    correct.map((v,i) => {
      if (v === true) {
        if (!newArr.includes(responses[i])) {
          newArr[i] = responses[i]
        }
      } else {
        const index = newArr.indexOf(responses[i])
        if (index !== -1) {
          newArr.splice(index,1)
        }
      }
      newArr.map((v,i) => {
        if (v === undefined) {
          newArr.splice(i,1)
        }
      })
      setCorrectVal(newArr)
    })
    
  }, [correct,responses])

  const handleTypeChange = (event) =>{
    setType(event.target.value)
    setCorrectVal([])
    
  }

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value)
  }
  const handleCorrectChange = (event) => {
    setCorrectVal([event.target.value])

  }
  const handleInputChange = (i,event) => {
    event.preventDefault()
    let newArr =[...responses]
    newArr[i] = event.target.value;
    setResponses(newArr)
  
  }
  const handleCheckChange = (i, event) =>{
    //event.preventDefault()
    let newArr = [...correct]
    newArr[i] = event.target.checked;
    setCorrect(newArr)
  }
  const createResponse = (event) => {
    event.preventDefault()
    setResponses([...responses, ''])
    setCorrect([...correct, false])
    setErrorTxt('')
  }
  const delQuestion = () => {
    deleteQuestion(num)
  }
  const delMC = (key) => {
    let newArr = [...responses]
    newArr.map((v,i) => {
      if (i === key) {
        if (key !== 0) {
          newArr.splice(i,1)
        }
        else {
          setErrorTxt('You cannot delete the first response!')
        }
      }
    })
    setResponses(newArr)
  }
  
  return (
    <div className="create-form-questions">
      {/* <MathComponent tex={String.raw`${question}`}/> */}
      <label htmlFor="type">{num}. Question type: </label>
      <select className = "create-form-dropdown" value={type} onChange={handleTypeChange} id="type">
        <option value="multiple-choice">Multiple choice</option>
        <option value="short-answer">Short answer</option>
      </select>
      <br />
      <input className = "create-form-input" onChange={handleQuestionChange} type="text" id="question" name="question" placeholder="Question "required/>
      <br />
      {type === "multiple-choice" ? 
        <div>
          {responses.map((v,i) => {
            return (
            <div style = {{display: 'flex', justifyContent: 'center', textAlign: 'center'}}key={`dv${i}`}>
              <input className = "create-form-mc-input" key = {"1234"}onChange = {(e) => handleInputChange(i,e)} placeholder="Response" value = {responses[i]} type="text" id="response" name="response" required/>
              <input style={{transform: 'translateY(100%)'}}key= {"5353"} onChange = {(e) => handleCheckChange(i,e)} value = {responses[i]} checked = {correct[i]} type="checkbox" id = "correct" />
              <img onClick={() => delMC(i)} alt = "trash" className= "trash-icon" src={trash}/>
            </div>
            )
          })}
          <p style={{color: 'red'}}>{errorTxt}</p>
          <button className ="create-mc-button" onClick={createResponse}>+</button>
        </div>: <input onChange={handleCorrectChange} className = "create-form-input" type="text" id="sa_response" name="sa_response" placeholder="Correct answer (leave blank if unwanted)"/>}
        <div><img onClick={delQuestion} alt = "trash" className= "trash-icon" src={trash}/></div>
    </div>
  )
}
