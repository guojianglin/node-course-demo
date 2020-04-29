const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const {userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Peter',
        email: '1448373124@qq.com',
        password: '123456789'
    }).expect(201)

    // Assert that the datebase was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Peter',
            email: '1448373124@qq.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('123456789')
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findOne({email: userOne.email})
    const tokenInDB = user.tokens[user.tokens.length -1].token
    expect(tokenInDB).toBe(response.body.token)

})

test('Should not login a noneexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypassword'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send().expect(401)
})

test('Should delete an account for user', async () => {
    await request(app).delete('/users/me')
    .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete user for unauthenticated user', async () => {
    await request(app).delete('/users/me').expect(401)
})

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Peter2'
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Peter2')
})

test('Should not update invalid user field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        locaton: 'someWhere'
    }).expect(400)
})