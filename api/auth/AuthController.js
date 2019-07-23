const AuthService = require('./AuthService')

async function login(req, res) {
    const { email, pass } = req.body;
    try {
        const user = await AuthService.login(email, pass)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}
async function signup(req, res) {
    const newUser = req.body;
    try {
        const user = await AuthService.signup(newUser)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        if(err === 'Email exists, login' ) res.status(400).send({ error: err })
        else res.status(401).send({ error: err })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}


module.exports = {
    login,
    signup,
    logout
}