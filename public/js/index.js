const socket = io()
const messagesEl = document.querySelector('#messages')
const inputElement = document.querySelector('.inputBox input')

messagesEl.innerHTML = ""
// messagesEl.appendChild(NUEVO ELEMENTO) 

const appendMessageElement = (user, time, msg) => {
  const div = document.createElement('div')
  div.classList.add('uk-width-1-1')
  div.innerHTML = `<span class="uk-label">${user} [${time}]</span> <span class="uk-margin-left">${msg}</span>`
  
  messagesEl.appendChild(div)

  // encierro en un set timeout
  // para que la altura del contenedor se actualice
  // con el nuevo nodo
  setTimeout(() => {
    messagesEl.scrollTo(0, messages.scrollHeight);
  }, 250)
}

const createJoinedElement = (user) => {
  return `<div class="uk-width-1-1 uk-flex joined">
          <span class="uk-label uk-label-success">${user} se unio</span>
        </div>`
}

// logica

let username = null
let currentMessages = []

socket.on('chat-messages', (messagesList) => {
  currentMessages = messagesList
})

Swal.fire({
  title: 'Ingresa tu nombre',
  input: 'text',
  inputAttributes: {
    autocapitalize: 'off'
  },
  confirmButtonText: 'Enviar',
  preConfirm: (username) => {
    // agregar logica
    if (!username) {
      Swal.showValidationMessage(
        `El usuario no puede estar en blanco`
      )
      return
    }
    
    return username
  },
  allowOutsideClick: false
}).then(({ value }) => {
  username = value
  console.log(username)

  // aqui voy a renderizar los mensajes actuales del server

  for (const { user, text } of currentMessages) {
    // renderizar
    appendMessageElement(user, '00:00', text)
  }

  socket.on('chat-message', ({ user, text }) => {
    // renderizar el mensaje
    appendMessageElement(user, '00:00', text)
  })

  inputElement.addEventListener('keyup', ({ key, target }) => {
    if (key !== 'Enter') {
      return
    }

    const { value } = target

    if (!value) {
      return
    }

    // enviar el mensaje al socket

    const msg = { user: username, text: value }

    socket.emit('chat-message', msg)
    target.value = ""
    appendMessageElement(username, '00:00', value)
  })
})

