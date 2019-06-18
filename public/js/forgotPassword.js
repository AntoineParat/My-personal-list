console.log('forgot.js ok')

const form = document.querySelector('form');
const successMsg = document.querySelector('#succesMsg');
const successDiv = document.querySelector('#succesDiv');
const newPasswordDiv = document.querySelector('#newPasswordDiv');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const mail = {
    email : e.target[0].value,
  }
    
  form.reset();

  fetch('/forgotpassword/mail', {
  method: 'POST',
  body: JSON.stringify(mail),
  headers: {'Content-Type': 'application/json'}
  })
  .then(resp => resp.json())
  .then(respParsed => {
    if (respParsed.msg) {
      newPasswordDiv.classList.add('hidden')
      succesDiv.classList.remove('hidden')
      successMsg.textContent = respParsed.msg
    }
    else {
      alert("Unable to send you a mail")
    }
  })
  .catch(error => console.log(error));
})