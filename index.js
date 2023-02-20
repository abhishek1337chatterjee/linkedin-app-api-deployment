

const express = require('express');

const app = express();

app.use(express.json());

const cors = require('cors');

app.use(cors({
    origin: "*"
}))

const dotenv = require('dotenv');
const { connection } = require('./configs/db');
const { userRouter } = require('./Routes/User.routes');
const { authenticate } = require('./middlewares/auth.middlewares');
const { postRouter } = require('./Routes/Post.routes');
dotenv.config();

app.get("/", (req, res) => {
    res.send("Home Page");
})

app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);



app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
    console.log(`listening on port ${process.env.port}`);
})