require('dotenv').config(); // Memuat file .env
const express = require("express");
const users = require('./routes/user-routes')

const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello word");
})

app.use('/api/users', users)


app.listen(port, () => {
  console.log(`server up and running on port ${port}`);
})