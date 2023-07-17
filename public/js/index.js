const socket = io()

const createSingleMessageElement = (user, time, msg) => {
  return `<div class="uk-width-1-1">
            <span class="uk-label">${user} [${time}]</span> <span class="uk-margin-left">${msg}</span>
          </div>`
}

const createJoinedElement = (user) => {
  return `<div class="uk-width-1-1 uk-flex joined">
          <span class="uk-label uk-label-success">${user} se unio</span>
        </div>`
}
