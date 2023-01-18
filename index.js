import fastify from 'fastify';
import { ChatGPTAPIBrowser } from 'chatgpt';
import { executablePath } from 'puppeteer';

const server = fastify();

// server.post('/question', async (request, reply) => {
async function sendMessage() {
try {
        console.log("Session")
        // const { question, email, password } = request.body

        const api = new ChatGPTAPIBrowser({
            email: 'email',
            password: 'password',
            // executablePath: executablePath(),
            minimize: false,
            isGoogleLogin: true
        });

        console.log(api)
        await api.initSession()
        const result = await api.sendMessage('question')
        console.log("result====================>", result);
        await api.closeSession()

        // reply.send(result)
    } catch (e) {
        console.log(e);
    }
}

server.listen({ port: process.env.PORT || 5000 }, (error) => {
    console.log("Server Started on port "+ (process.env.PORT || 5000))
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

await sendMessage()