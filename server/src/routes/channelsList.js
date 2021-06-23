const express = require('express')
const router = express.Router()
const ChannelsList = require('../models/channelsList')
const shared = require('../shared');

// Get all
router.get('/', async (req, res) => {
    try {
        const felids = shared.getReqQueryFelids(req)
        const channelsList = await ChannelsList.find({}, felids)
        res.json(channelsList)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
})

// Get one
router.get('/:id', getChannelsList, (req, res) => {
    res.json(res.channelsList)
})

// Create one
router.post('/', async (req, res) => {
    const channelsList = new ChannelsList({
        name: req.body.name,
        author: req.body.author,
        upVotes: req.body.upVotes,
        numOfUsers: req.body.numOfUsers,
        list: req.body.list
    })

    try {
        const newChannelsList = await channelsList.save()
        res.status(201).json(newChannelsList)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update one
router.patch('/:id', getChannelsList, async (req, res) => {
    if (req.body.name !== null) {
        res.channelsList.name = req.body.name
    }
    if (req.body.author !== null) {
        res.channelsList.author = req.body.author
    }
    if (req.body.upVotes !== null) {
        res.channelsList.upVotes = req.body.upVotes
    }
    if (req.body.numOfUsers !== null) {
        res.channelsList.numOfUsers = req.body.numOfUsers
    }
    if (req.body.list !== null) {
        res.channelsList.list = req.body.list
    }

    try {
        const updatedChannelsList = await res.channelsList.save()
        res.json(updatedChannelsList)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete one
router.delete('/:id', getChannelsList, async (req, res) => {
    try {
        await res.channelsList.remove()
        res.json({ message: "Deleted Channels List" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getChannelsList(req, res, next) {
    let channelsList
    try {
        channelsList = await ChannelsList.findById(req.params.id)
        if (channelsList === null) {
            return res.status(404).json({ message: "Can't find channelsList" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })

    }
    res.channelsList = channelsList
    next()
}

module.exports = router