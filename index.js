require('dotenv').config(); // Memuat file .env
const express = require("express");
const users = require('./routes/user-routes')
const posts = require('./routes/post-routes')

const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello word");
})

app.use( '/api/users', users )
app.use( '/api/posts',posts )

app.listen(port, () => {
  console.log(`server up and running on port ${port}`);
})