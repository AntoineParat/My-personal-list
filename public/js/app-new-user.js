 /* CREATE NEW USER */
console.log("ok js new user")

const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = {
        email : e.target[0].value,
        password : e.target[1].value,
        name : e.target[2].value
    }
    form.reset();
    fetch('/sign-up/user', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {'Content-Type': 'application/json'}
  })
  .then(resp => resp.json())
  .then(respParsed => { 
     window.location = respParsed.redirectUrl;
    })
  .then(() => {
    fetch('/me/newtask/add', {
    method: 'POST',
    body: JSON.stringify({
    description : `This is your first task exemple ! Add it as much as you want to, simply clicking on "Task(s)" !`
    }),
    headers: {'Content-Type': 'application/json'}
  })
  })  
  .catch(error => console.log(error));


  

})
