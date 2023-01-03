const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 8000
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGO_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("CONNECTED TO DB");
}).catch(err => console.log(err));

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use('/api', authRoutes)
app.use('/api', userRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});