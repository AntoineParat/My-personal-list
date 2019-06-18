console.log('ok js register')
// Get the modal
var modal = document.getElementById("Modal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.querySelector(".cross");



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = {
    email : e.target[0].value,
    password : e.target[1].value
  }
    
  form.reset();

  fetch('/user/login', {
  method: 'POST',
  body: JSON.stringify(user),
  headers: {'Content-Type': 'application/json'}
  })
  .then(resp => resp.json())
  .then(respParsed => {
    if(respParsed.redirectUrl) { 
    window.location = respParsed.redirectUrl;
  }
    else {alert(respParsed.error)}
  })
  .catch(error => console.log(error));
})

