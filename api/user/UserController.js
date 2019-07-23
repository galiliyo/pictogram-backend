const UserService = require('./UserService')

module.exports = {
    getUsers,
    getUser,
    updateUser
}

async function getUsers(req, res) {
    // const id = req.query
    try {
        const users = await UserService.getUsers()
        res.json(users)
    } catch (err) {
        res.status(404).send('Unknown Users')
    }
}

async function getUser(req, res) {
    const id = req.params.id
    try {
        const user = await UserService.getById(id)
        res.json(user)
    } catch{
        res.status(404).send('Unknown User')
    }
}


async function updateUser(req, res) {
    const user = req.body
    try {
        const updatedUser = await UserService.update(user)
        res.json(updatedUser)
    } catch{
        res.status(500).send('Could Not Edit')
    }
}