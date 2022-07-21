const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();
const ip = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 8500;
const cors = require('cors');
const bot = require('./bot');
app.use(cors())

app.get('/api/', async (req, res, next) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CX}&q=${req.query.q}&num=2`);
        console.log(response.data.items[0].link);
        console.log(response.data.items[0].displayLink);
        const result = await bot(response.data.items[0].link);
        res.send(result);
        next();
    } catch (error) {
        next(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});