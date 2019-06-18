console.log('reset forgotten password ok')

const form = document.querySelector('form');
const successMsg = document.querySelector('#succesMsg');
const successDiv = document.querySelector('#succesDiv');
const newPasswordDiv = document.querySelector('#newPasswordDiv');

form.addEventListener('submit', function(e) {
  e.preventDefault();
 
  const password0 = e.target[0].value
  const user = {
    resetNumber: e.target[2].value,
    password : e.target[1].value
  }
    
  form.reset();

  if(password0.length <6) {
    alert('password must has at least 6 characters')
  }
  else if(user.password !== password0) {
    alert(`New password and Verify password don't match !`)
  }
  else {
    fetch('/setnewpassword', {
    method: 'POST',
    body: JSON.stringify(user),
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
        alert(respParsed.msg)
      }
    })
    .catch(error => console.log(error));
  }
})

