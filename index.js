import fastify from 'fastify';
import { ChatGPTAPIBrowser, getOpenAIAuth, ChatGPTAPI } from 'chatgpt';
import proxyChain from 'proxy-chain';
import puppeteer from 'puppeteer';
import arr from './ps.js'

async function newBrowser() {

    const proxy = '45.158.187.139:7148';
    const username = 'zxrmlhkl';
    const password = '4vpmugc098he';

    const originalUrl = `http://${username}:${password}@${proxy}`;
    const newUrl = await proxyChain.anonymizeProxy(originalUrl);

    console.log(newUrl)
    const puppeteerArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--ignore-certificate-errors',
        '--no-first-run',
        '--no-service-autorun',
        '--password-store=basic',
        '--system-developer-mode',
        '--mute-audio',
        '--disable-default-apps',
        '--no-zygote',
        '--disable-accelerated-2d-canvas',
        '--disable-web-security'
    ]
    const browser = await puppeteer.launch(
        {headless: false,
            args: [
                `--proxy-server=${newUrl}`,
                '--proxy-bypass-list=<-loopback>',
                ...puppeteerArgs
            ],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    //

    const api = new ChatGPTAPIBrowser({
        email: arr.email,
        password: arr.password,
        proxyServer: newUrl,
        isGoogleLogin: true,
    });

        console.log(api)
        await api.initSession()
        const result = await api.sendMessage('Write a python version of bubble sort.')

        // result.response is a markdown-formatted string
        console.log(result)
        await api.closeSession()
        await proxyChain.closeAnonymizedProxy(newUrl, true);


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

