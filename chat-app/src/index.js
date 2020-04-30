const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = new express();
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))
io.on('connection', (socket) => {

    socket.on('join', ({ username, room}, callback) => {
        const { error, user } = addUser({id: socket.id, username, room})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Admin',`Welcome! ${user.username}`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has join!`))

        callback()
        io.to(user.room).emit('roomDate', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('sendMessage', (mes, callback) => {
        const filter = new Filter()
        if (filter.isProfane(mes)) {
            return callback('Profanity is not allowed')
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username, mes))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocation(user.username, location))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomDate', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})


const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('the chat app is up to 3000')
})