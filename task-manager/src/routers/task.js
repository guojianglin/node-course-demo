const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    try {
        // const task = new Task(req.body);
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save();
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// Get /tasks?sortBy=createAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1: -1
    }

    try {
        // const tasks = await Task.find({});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        const tasks = req.user.tasks
        if (!tasks.length) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch(err) {
        res.status(500).send(err)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) =>  {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', "description"];
    const isValidUpdate = updates.every(item => allowedUpdates.includes(item));

    if (!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates'});
    }

    try {
        const _id = req.params.id;
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        console.log(task)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})


module.exports = router