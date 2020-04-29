const {userOne, userTwo, setupDatabase, taskOne } = require('./fixtures/db')
const app = require('../src/app')
const request = require('supertest')
const Task = require('../src/models/task')
beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From the test'
    }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should only get tasks for userOne', async () => {
    const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${ userOne.tokens[0].token }`)
    .expect(200)
    expect(response.body.length).toBe(2)
})

test('Should only delete specific task', async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})