#!/usr/bin/env node
import fastify from 'fastify';
import { ChatGPTAPIBrowser } from 'chatgpt';

const server = fastify();

server.post('/question', async (request, reply) => {
    try {
        const { question, email, password } = request.body
        const api = new ChatGPTAPIBrowser({
            email: email,
            password: password,
            isGoogleLogin: true
        });

        await api.initSession()
        const result = await api.sendMessage(question)
        console.log("result====================>", result);
        await api.closeSession()

        reply.send(result)
    } catch (e) {
        console.log(e);
    }
});

server.listen({ port: 3000 }, (error) => {
    console.log("Server Started")
    if (error) {
        console.error(error);
        process.exit(1);
    }
});