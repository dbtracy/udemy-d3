const form = document.querySelector('form')
const name = document.querySelector('#name')
const cost = document.querySelector('#cost')
const error = document.querySelector('#error')

form.addEventListener('submit', (event) => {

  event.preventDefault()

  if (name.value && cost.value) {
    const item = {
      name: name.value,
      cost: cost.value
    }
  } else {
    error.textContent = 'Please enter values before submitting'
  }

})
