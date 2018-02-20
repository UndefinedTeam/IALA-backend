const request = require('supertest')
const app = require('../app')

jest.mock('../models/user')
jest.mock('../models/todolist')
jest.mock('../models/task')


describe("App", ()=>{
  it("User Endpoint Loads", ()=>{
    return request(app).get("/user").then(response =>{
    	expect(response.statusCode).toBe(401)
    })
  })

  it("Endpoint for List of Users", ()=>{
    return request(app).get("/user").then(response =>{
	    expect(response.statusCode).toBe(200)
	    expect(response.body.user[0].name).toBe('Bob Test')
    })
  })

  it("Endpoint for User and lists", ()=>{
	return request(app).get("/user/1/lists").then(response =>{
		expect(response.statusCode).toBe(200)
		expect(response.body.user.name).toBe('Bob Test')
		expect(response.body.lists[0].title).toBe('Test List')
    })
  })

  it("Endpoint for tasks within a list", ()=> {
	return request(app).get("/list/1/tasks").then(response =>{
		expect(response.statusCode).toBe(200)
		expect(response.body.tasks[0].desc).toContain('Test')
    })
  })

  it("Creates a new user", ()=> {
	return request(app).post("/user").then(response =>{
		expect(response.statusCode).toBe(200)
		expect(response.body.user[2].name).toContain('SallyBob')
    })
  })

  it("Creates a new list", ()=> {
    return request(app).post("/user/1/lists").then(response =>{
	  	expect(response.statusCode).toBe(200)
	  	expect(response.body.list[0].title).toContain('Birthday Party')
    })
  })

  it("Creates a new task", ()=> {
    return request(app).post("/user").then(response =>{
	  	expect(response.statusCode).toBe(200)
	  	expect(response.body.task.title).toContain('SallyBob')
    })
  })

  it("Updates a task", ()=> {
	return request(app).post("/list/1/tasks/1").then(response =>{
		expect(response.statusCode).toBe(200)
		expect(response.body.task.title).toContain('SallyBob')
	})
  })

  it("Deletes a task", ()=> {
	return request(app).post("/list/1/task/2").then(response =>{
		expect(response.statusCode).toBe(400)
	})
  })

})
