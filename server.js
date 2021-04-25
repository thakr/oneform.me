const express = require('express');
const cors = require('cors');
const app = express();
const {OAuth2Client} = require('google-auth-library')
const mongoose = require('mongoose')
const User = require('./models/User');
const Form = require('./models/Form');
const PORT = process.env.PORT || 8080
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const client = new OAuth2Client(process.env.OATH_CLIENT)

app.use(express.json());
app.use(cors())

app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
      if (req.headers['x-forwarded-proto'] !== 'https')
          return res.redirect('https://' + req.headers.host + req.url);
      else
          return next();
  } else
      return next();
});

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true
})
//let db = mongoose.connection;

app.post('/api/send-answer', function (req, res) {
  User.findById(req.body.userId).then(user => {
    let haveId = false
    for (let i = 0; i < user.questionsAnswered.length; i++) {
      if (user.questionsAnswered[i].id === req.body.id) {
        haveId = true
        if (user.questionsAnswered[i].responses.question !== req.body.question) {
          user.questionsAnswered[i].responses.push({question: req.body.question, answer: req.body.data})
          Form.findById(req.body.id).then(form => {
            let found = false
            form.usersAnswered.map(v => {
              if (v.id.toString() == user._id.toString()) {
                found = true
              }
            })
            if (found === false) {
              form.usersAnswered.push({id: user._id, name:user.name})
              form.markModified("usersAnswered")
              form.save()
            }
            
          })
          user.markModified('questionsAnswered')
          user.save((err) => {
            if (err) console.log(err)
          })
        }
        
      }
    }
    if (haveId === false) {
      user.questionsAnswered.push({id: req.body.id, responses: [{question: req.body.question, answer: req.body.data}]})
      Form.findById(req.body.id).then(form => {
        let found = false

        form.usersAnswered.map(v => {

          if (v.id.toString() == user._id.toString()) {
            found = true
          }
        })
        if (found === false) {
          form.usersAnswered.push({id: user._id, name:user.name})
          form.markModified("usersAnswered")
          form.save()
        }
        
      })
      user.markModified('questionsAnswered')
      user.save()
    }
    
  })
  res.sendStatus(200)
});

app.post('/api/create-form', (req,res) => {
  let user = req.body.user;
  const newForm = new Form({
    title: req.body.title,
    author: user.name,
    authorid: user._id,
    questions: req.body.questions
  })
  newForm.save().then(newForm => {
    User.findById(user._id).then(user => {
      user.forms = [...user.forms, newForm._id]
      user.save()
    })
    res.send({formId: newForm._id})
  })
  
  // let id = forms[forms.length-1].id + 1
  // let formJSON = req.body
  // formJSON.id = id
  // forms.push(formJSON)
  
})

app.get('/api/formanswers', function (req,res) {
  User.findById(req.query.userId).then(user => {
    let found = null
    for (let i = 0; i < user.questionsAnswered.length; i++) {
      if (req.query.id === user.questionsAnswered[i].id) {
        found = i
      }
    }
    if (found != null) {
      res.send(user.questionsAnswered[found])
    } else {
      res.send({
        responses: []
      })
    }
  })
  
})

app.get('/api/forms', (req,res) =>{
  Form.findOne({_id: req.query.id}).then(form => {
    if (form) {
      res.send(form)
    } else {
      console.log('not found')
    }
  }).catch(err => {
    if (err instanceof mongoose.CastError) {
      res.send({error: 404})
    } else {
      res.send({error: 'Unknown'})
    }
  })
  // let found = null
  // let id = parseInt(req.query.id)
  // for (let i= 0; i < forms.length; i++) {
  //   if (forms[i].id === id) {
  //     found = i;
  //   } 
  // }
  // if (found != null) {
  //   res.send(forms[found])
  // } else {
  //   res.sendStatus(404);
  // }
  
});
app.post('/api/auth/google', async (req,res) => {
  const { token, redirect } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.OATH_CLIENT
  })
  const {name, email, picture} = ticket.getPayload();
  User.findOne({email : email}).then(user => {
    if (!user) {
      const newUser = new User({
        name: name,
        email: email,
        pictureUrl: picture
      });
      newUser.save()
      .then ((newUser) => {
        res.json({
          name: newUser.name,
          email: newUser.email,
          pictureUrl: newUser.pictureUrl,
          _id: newUser._id,
          redirect: redirect
        })
      });
    } else {
      res.json({
        name: user.name,
        email: user.email,
        pictureUrl: user.pictureUrl,
        _id: user._id,
        redirect: redirect
      })
    }
    
  })
})
app.get('/api/user', async (req,res) => {
  const id = req.query.id
  User.findById(id).then(user => {
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        pictureUrl: user.pictureUrl,
        _id: user._id
      })
    } else {
      res.status(404);
    }
  })
})
app.get('/api/get-user-forms', async (req,res) => {
  
  const id = req.query.id
  let forms = []
  const user = await User.findById(id)
  if (user) {  
    let formsMapPromise = user.forms.map(v => new Promise((res,rej) => {
      Form.findOne({_id: v}).then(form => {
        if (form) {
          forms.push(form)
          
        } else {
          console.log('not found')
        }
        res()
      })
      
    
    
    }))
  await Promise.all(formsMapPromise).then(() => res.json({forms: forms}))
  
}
app.post('/api/remove-form', (req,res) => {
  const formid = req.body.formid
  const userid = req.body.userid
  Form.deleteOne({_id: formid}, (err) => {
    if (err) {console.log(err)} else {
      console.log('deleted successfully')
      User.findById(userid).then(user => {
        const formIndex = user.forms.indexOf(formid)
        if (formIndex != -1) {
          user.forms.splice(formIndex,1)
          res.sendStatus(200)
          
        } else {
          console.log('form not found in user list')
        }
        user.save()
        
      })
    };
    
  })
  
  
})

})

if (process.env.NODE_ENV === 'production') {

  app.use(express.static('client/build'))
  app.get('*', (req,res) => {
    
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}
//oath

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
console.log('listening on port' + PORT)
app.listen(PORT);
