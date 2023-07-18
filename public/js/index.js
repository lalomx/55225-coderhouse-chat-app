const socket = io()
const messages = document.querySelector('#messages')
const input = document.querySelector('.inputBox input')

messages.innerHTML = ""
// Swal.fire({
//   title: "Identificate",
//   text: "Ingresa tu nombre",
//   icon: "success"
// })

let user = null
let previousMessages = []

socket.on('chat-messages', (list) => previousMessages = list)

Swal.fire({
  title: "Identificate",
  text: "Ingresa tu nombre",
  input: "text",
  preConfirm: (user) => {
    if (!user) {
      Swal.showValidationMessage(
        `El usuario no puede estar en blanco`
      )
      return
    }
    
    return user
  },
  allowOutsideClick: false
}).then(({ value }) => {
  user = value
  for (const { user, msg} of previousMessages) {
    addMessageToList(user, msg)
  }

  socket.on('chat-message', ({ user, msg}) => {
    addMessageToList(user, msg)
  })
})


const createSingleMessageElement = (user, time, msg) => {
  const element = document.createElement('div')
  element.classList.add("uk-width-1-1")
  element.innerHTML = `<span class="uk-label">${user} [${time}]</span> <span class="uk-margin-left">${msg}</span>`

  return element
}

const createJoinedElement = (user) => {
  return `<div class="uk-width-1-1 uk-flex joined">
          <span class="uk-label uk-label-success">${user} se unio</span>
        </div>`
}

const addMessageToList = (user, message) => {
  const element = createSingleMessageElement(user, '18:35', message)

  messages.appendChild(element)

  setTimeout(() => {
    messages.scrollTo(0, messages.scrollHeight + 50);
    messages.scrollTop = messages.scrollHeight;
  }, 250)
}


input.addEventListener('keyup', (ev) => {
  if(ev.key !== 'Enter') {
    return
  }

  if (!input.value?.trim()) {
    return
  }

  const value = input.value

  addMessageToList(user, value)
  socket.emit('chat-message', { user, msg: value })

  input.value = ''
})