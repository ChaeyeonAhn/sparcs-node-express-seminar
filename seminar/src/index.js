const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

require('dotenv').config();
app.use(express.json());

const accountRouter = require('./routes/account');


const port = process.env.PORT;

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
}

app.use(cors(corsOptions));
app.use('/account', accountRouter);
app.use('/static', express.static(path.join(__dirname,'public')));



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/status', (req, res) => {
    res.status(200).json({isOnline: true});
});

app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});
