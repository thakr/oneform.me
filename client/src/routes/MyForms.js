import React, {useState,useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import Navbar from '../components/Navbar.js'
import trash from '../images/trash.svg'


export const MyForms = () => {
  let d = new Date();
  let n = d.getHours();
  if (n > 18) {
    document.documentElement.className = "night-theme"
  } else if (n < 4) {
    document.documentElement.className = "night-theme"
  } else if (n > 4) {
    document.documentElement.className = "day-theme"
  }
  const [formData, setFormData] = useState([])
  const [loading,setLoading] = useState(true)
  const [deleting,setDeleting] = useState([])

  async function fetchData() {
    if (localStorage.getItem('user') != null) {
      const user = await fetch(`/api/get-user-forms?id=${JSON.parse(localStorage.getItem('user'))._id}`, {
        method: "GET"
      })
      let data = await user.json()
      data.forms.map(v => {
        const date = new Date(v.dateCreated);
        const time = Math.floor(date/1000)
        v["time"] = time;
      })
      data.forms.sort((a,b) => {return (b.time-a.time)})
      setFormData(data.forms)
      setLoading(false)
      }
    }
  useEffect(() => {
    fetchData()
  }, [])

  const deleteForm = async (id) => {
    setDeleting([...deleting, id])
    const res = await fetch('/api/remove-form', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          formid: id,
          userid: JSON.parse(localStorage.getItem('user'))._id
        })
    })
    let newArr = [...deleting]
    const index = newArr.includes(id)
    newArr.splice(index, 1)
    setDeleting(newArr)
    console.log(res)
    fetchData()
  }

  console.log(formData)
  return (
     <>
    {!localStorage.getItem('user') ? <Redirect to="/"/> : 
    <>
    <Navbar />
    <div className="my-forms-wrapper">
      {loading? <p style={{textAlign: 'center'}}>Loading...</p> : 
      formData.length === 0? <p style={{textAlign: 'center'}}>Looks like you don't have any forms. <a href = "/create">Create</a> some to get started.</p>:         
      formData.map((v,i) => {

        return <div key={v._id} className="my-forms-item"> <a href={`/form/${v._id}`}>{v.title}</a> {deleting.includes(v._id) ? <p>deleting...</p>:<img onClick={() => deleteForm(v._id)} alt = "trash" className= "my-forms-trash-icon" src={trash}/>}</div>
      })}
      
    </div>
    </>
    }
    </>
  )
}
