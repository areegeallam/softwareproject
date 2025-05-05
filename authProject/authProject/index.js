require('dotenv').config();
const express = require("express")
const helmet = require("helmet")
const cors = require('cors')
const cookieParser = require("cookie-parser")

require('./db'); // بس استدعاء الاتصال هنا، مش لازم تسميه mongoose تاني

const authRouter = require('./routers/authRouter')

const app = express()
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "Hello from server" })
})

app.use('/api/auth', authRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
