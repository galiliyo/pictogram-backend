const ChatService = require('./ChatService')


module.exports = {
    addChat,
    getChat,
    updateChat
}


async function addChat(req, res) {
    const newChat = req.body
    try {
        const chat = await ChatService.add(newChat)
        res.json(chat)
    } catch (err) {
        res.status(500).send('Could Not Add')
    }

}

async function getChat(req, res) {
    const id = req.params.id;
    try {
        const chat = await ChatService.getById(id)
        res.json(chat)
    } catch (err) {
        res.status(404).send('Unknown Chat')
    }
}

async function updateChat(req, res){
    const chat = req.body;
    try{
        const updatedChat = await ChatService.update(chat)
        res.json(updatedChat)
    }catch(err){
        res.status(500).send('Could Not Update')
    }
}