require('./env')
const express = require('express')

const app = express()

app.use(express.static('public'))
app.use(function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})

app.listen(process.env.PORT, function () {
  console.log(`
    Started application
    ENV: ${process.env.NODE_ENV}
    PORT: ${process.env.PORT}
  `)
})
