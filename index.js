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

const messages = []

const userOnline = {}

io.on('connection', (socket) => {
  console.log('new connction')

  /// logica de mensajes
  socket.emit('chat-messages', messages)

  socket.on('chat-message', (msg) => {
    messages.push(msg)
    console.log(msg)
    socket.broadcast.emit('chat-message', msg)
  })

  socket.on('user', ({ user, action }) => {
    userOnline[socket.id] = user
    socket.broadcast.emit('user', { user, action })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user', {
      user: userOnline[socket.id],
      action: false
    })

    delete userOnline[socket.id] // como borrar la propiedad del objeto
  })
})

const port = 3000

server.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})