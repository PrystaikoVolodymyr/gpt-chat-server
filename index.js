import fastify from 'fastify';
import { ChatGPTAPIBrowser, getOpenAIAuth, ChatGPTAPI } from 'chatgpt';

import arr from './ps.js'

async function newBrowser() {
    const api = new ChatGPTAPIBrowser({
        email: arr.email,
        password: arr.password,
        minimize: false,
        isGoogleLogin: true,
    });

        console.log(api)
        await api.initSession()
        const result = await api.sendMessage('Write a python version of bubble sort.')

        // result.response is a markdown-formatted string
        console.log(result)
        await api.closeSession()

}

await newBrowser()
const server = fastify();

server.post('/question', async (request, reply) => {
try {
        console.log("Session")
        const { question, email, password } = request.body

        const api = new ChatGPTAPIBrowser({
            email: email,
            password: password,
            minimize: false,
            isGoogleLogin: true
        });

        await api.initSession()

        const result = await api.sendMessage(question)
        console.log("result====================>", result);
        await api.closeSession()

    } catch (e) {
        console.log(e);
    }
})

server.get('/', async (request, reply) => {
     reply.send("You are here")
})
server.listen({ port: process.env.PORT || 5000 }, (error) => {
    console.log("Server Started on port "+ (process.env.PORT || 5000))
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

