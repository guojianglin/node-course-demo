const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router();
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const multer = require('multer')

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateToken()
        await sendWelcomeEmail(user.email, user.name)
        // await user.save();
        res.status(201).send({user, token});
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user, token})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {

    try {
        const _id = req.params.id;
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(err) {
        res.status(500).send(err)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(item => allowedUpdates.includes(item))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const user = req.user

        updates.forEach(update => user[update] = req.body[update])

        await user.save()
        res.send(user);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        await sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(err) {
        res.status(500).send(err)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({error: err.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send(err)
    }
})

module.exports = router