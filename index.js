const express = require('express')
const http = require('http')
const path = require('path')
const handlebars = require('express-handlebars')
const { Server } = require("socket.io");

const app = express() // app express
const server = http.createServer(app) // server http montado con express
const io = new Server(server) // web socket montado en el http

app.engine('handlebars', handlebars.engine()) // registramos handlebars como motor de plantillas
app.set('views', path.join(__dirname, '/views')) // el setting 'views' = directorio de vistas
app.set('view engine', 'handlebars') // setear handlebars como motor de plantillas

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/static', express.static(path.join(__dirname + '/public')))


app.get('/', (req, res) => {
  res.render('home')
})

io.on('connection', (socket) => {
  console.log('new connction')
})

const port = 3000

server.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})