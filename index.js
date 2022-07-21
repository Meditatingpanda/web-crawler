const puppeteer = require('puppeteer');
const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();
const ip = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 8500;
const cors = require('cors')
app.use(cors())

app.get('/api/', async (req, res, next) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CX}&q=${req.query.q}&num=2`);
        console.log(response.data.items[0].link);
        console.log(response.data.items[0].displayLink);
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.setRequestInterception(true);

        //if the page makes a  request to a resource type of image or stylesheet then abort that request
        page.on('request', request => {
            if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font' || request.resourceType() === 'manifest' || request.resourceType() === 'script' || request.resourceType() === 'texttrack' || request.resourceType() === 'fetch' || request.resourceType() === 'eventsource' || request.resourceType() === 'websocket' || request.resourceType() === 'xhr' || request.resourceType() === 'other')
                request.abort();
            else
                request.continue();
        });

        await page.goto(response.data.items[0].link);

        const grabCode = await page.evaluate(() => {
            return document.querySelector('.code-container').innerHTML;
        })
        console.log('scrapping done!!')
        res.send(grabCode);
        // await page.close();
        // await browser.close();
        next();
    } catch (error) {
        next(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});