var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var User = require('./models').User
var TodoList = require('./models').TodoList
var Task = require('./models').Task
var apiKey = 'M6w60G2RL_F_kiACA3VphibduaHe_ge5DwPkzFgJQj6GL6fq6eWnL_VV7pxcM6iAfvc2FAHg4G-5XXysQgtX8wU7JjdJkrhz1sklOA7J8FhPgj7shUfHVKNiYt17WnYx'

const yelp = require('yelp-fusion')
const client = yelp.client(apiKey)

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

const authorization = function(req, res, next){
  const token = req.query.authToken || req.body.authToken
  console.log("Token:", token)
  if(token){
    User.findOne({
      where: {authToken: token}
    }).then((user)=>{
      if(user){
        req.currentUser = user
        next()
      }else{
        res.status(401)
        res.json({message:'Authorization Token Invalid'})
      }
    })
  }else{
    res.status(401)
    res.json({message: 'Authorization Token Required'})
  }
}

app.get('/login/:email', (req, res) => {
   console.log(req.params.email);
   User.findOne({
      where:{email: req.params.email}
   })
   .then(user => {
      res.json({
         token: user.authToken,
         expiration: user.authTokenExpiration
      })
      console.log(user.authToken);
   })
   .catch(error => {
      res.json({message: "Failed to retrieve authToken"})
   })
})

app.post('/login', (req,res) => {
  User.findOne({
    where:{email: req.body.email}
  })
   .then( user => {
      if(user.verifyPassword(req.body.password)) {
         user.setAuthToken()
         user.update({
            authToken: user.authToken
         })
         .then(user => {
            res.json({token: user.authToken})
         })
         .catch(error => {
            res.json({message: "Unabale to set auth token"})
         })
      } else {
         res.status(401)
      }
   })
   .catch(error => {
      res.json({message: "Unable to log in"})
   })
})


//APIURL/user?authToken=putTokenHeretoken
//Gets user info for user with matching auth token
app.get('/user',
authorization ,
(req, res) => {
  res.json({user: req.currentUser})
})

//Creates a new user based on information from the Registration Form
app.post('/user', function(req, res){
  User.create(
    {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      zip: req.body.zip
    }
  ).then((user)=>{
    res.json({
      message: 'success',
      user: user
    })
  }).catch((error)=>{
    res.status(400)
    res.json({
      message: "Unable to create User",
      errors: error.errors
    })
  })
})

app.get('/lists', (req, res) => {
  TodoList.findAll().then((lists) => {
    res.json({
        lists: lists
    })
  })
})

// Gets all lists of one user based on the user id
app.get('/user/:id/lists', (req, res) => {
    User.findById(req.params.id)
    .then((user) => {
        TodoList.findAll({
            where: {
                userId: user.id
            }
        })
        .then((lists) => {
            res.json({
                lists: lists
            })
        })
        .catch((error) => {
            res.send(error)
        })
    })
    .catch((error) => {
        res.send(error)
    })
})

// Creates a new list for a user from the add list form on the dashboard
app.post('/user/:id/lists', (req, res) => {
        TodoList.create(
            {
                title: req.body.title,
                type: req.body.type,
                userId: req.params.id
            }
        )
        .then((list)=>{
          res.json({
            message: 'success',
            list: list
          })
        })
        .catch((error)=>{
          res.status(400)
          res.json({
            message: "Unable to create list",
            errors: error.errors
          })
      })
})

// Deletes a list for a user
app.delete('user/:id/list/:listId', (req, res) =>{
	TodoList.destroy({
		where: {
			id: req.params.listId
		}
	})
	.then(deletedList => {
		res.json(deletedList)
	})
	.catch((err) => {
		res.status(400)
		res.json({
			errors: err
		})
	})
})

// Gets all tasks that are part of a list by the list id
app.get('/list/:id/tasks', (req, res) => {
    TodoList.findById(req.params.id).then((list) => {
        Task.findAll({
            where: {
                listId: list.id
            }
        }).then((task) => {
            res.json({
                task: task
            })
        })
    }).catch((error) => {
        res.send(error)
    })
})

//adds a new task for a specific list based on id
app.post('/list/:id/tasks', (req,res) => {
    Task.create(
        {
            task: req.body.task,
            desc: req.body.desc,
            isComplete: req.body.isComplete,
            dateStart: req.body.dateStart,
            dateDone : req.body.dateDone,
            listId: req.params.id
        }
    )
    .then((task)=>{
        res.json({
            message: 'success',
            task: task
        })
    })
    .catch((error)=>{
        res.status(400)
        res.json({
	        message: "Unable to create task",
	        errors: error.errors
        })
    })
})

//Updates tasks from task edit form
app.put('/list/:id/tasks/:taskId', (req,res) => {
    Tasks.update({
		where: {
			id: req.params.taskId
		},
			task: req.body.task,
			desc: req.body.desc,
			isComplete: req.body.isComplete,
			type: req.body.type,
			dateStart: req.body.dateStart,
			dateDone : req.body.dateDone,
			listId: req.params.id
	})
    .then((updatedTask)=>{
        res.json({
            message: 'success',
            task: updatedTask
        })
    })
    .catch((error)=>{
        res.status(400)
        res.json({
        message: "Unable to update task",
        errors: error.errors
        })
    })
})

// Deletes a task from a list
app.delete('/list/:id/tasks/:taskId', (req, res) =>{
	Tasks.destroy({
		where: {
			id: req.params.taskId
		}
	})
	.then(deletedTask => {
		res.json(deletedTask)
	})
	.catch((err) => {
		res.status(400)
		res.json({
			errors: err
		})
	})
})


//backend API that fetches info from yelp
//searches yelp and returns the results in a json body
//https://www.npmjs.com/package/yelp-fusion <--yelps NPM package
app.get('/yelp/:search/:location', (req, res) => {
    console.log(req.params.search)
    console.log(req.params.location)
    client.search({
        term: req.params.search,
        location: req.params.location
    }).then((response) => {
    //return entire json object from yelp
      res.json(response.jsonBody)
    }).catch(e => {
        console.log(e)
    })
})

module.exports = app
