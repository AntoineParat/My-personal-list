console.log("credentials.js ok");

const resetName = document.querySelector("#resetName");
const resetMail = document.querySelector("#resetMail");
const resetPassword = document.querySelector("#resetPassword");

const sidebarSearch = document.querySelector('.sidebar-search');

sidebarSearch.classList.add('hidden')

/* UPADATE NAME*/

resetName.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = e.target[0].value
    fetch("/me/credentials/name", {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
    })
    .then(resp => resp.json())
    .then(json => alert(json.msg))
    .then(() => {
        const userName = document.querySelector(".user-name");
        userName.textContent=name;
    })
    .catch(err => alert(err.err))
})

/* UPADATE MAIL*/

resetMail.addEventListener('submit', function(e) {
    e.preventDefault();
    const newMail = {
        mail : e.target[0].value,
        password : e.target[1].value
    }
    resetMail.reset()
    fetch("/me/credentials/mail", {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newMail)
    })
    .then(resp => resp.json())
    .then(json => alert(json.msg))
    .catch(err => alert(err.err))
})

/* UPADATE PASSWORD*/

resetPassword.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = {
        currentPassword : e.target[0].value,
        newPassword : e.target[1].value,
        verifyPassword : e.target[2].value,
    }
    resetPassword.reset()
    if(password.newPassword.length <6) {
        alert('password must has at least 6 characters')
    }
    else if(password.newPassword !== password.verifyPassword) {
        alert(`New password and Verify password don't match !`)
    }
    else{
        fetch("/me/resetpassword", {
            method : 'PATCH',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(password)
        })
    .then(resp => resp.json())
    .then(json => alert(json.msg))
    .catch(err => console.log(err.err))
    }
    
})

/*UPLOAD PROFILE PICTURE */

const uploadButton = document.querySelector('#browse-btn');
const realInput = document.getElementById('real-input');

uploadButton.addEventListener('click', () => {
  realInput.click();
});

realInput.addEventListener('change', () => {
  let bodyFormData = new FormData();
  bodyFormData.append('avatar', realInput.files[0]); 
  fetch('/me/upload/avatar', { 
    method: 'POST',
    headers: { },// 'Content-Type': 'multipart/form-data'},
    body: bodyFormData
  })
  .then( response => response.json())
  .then( resp => window.location = resp.redirect || alert(resp.message)) 
  .catch();
});

/* DELETE USER ACCOUNT*/

 function deleteAll() {
   fetch('/me/delete/alltasks', { 
    method: 'DELETE',
  })
  fetch('/me/delete/user', { 
    method: 'DELETE',
  })
  .then(resp =>resp.json())
  .then(json => {
    if(json.redirectUrl) {
      window.location = json.redirectUrl;
    }
    else{alert("Server is unable to delete your account")}
  })
}


function deleteModal() {
  modal.innerHTML=`You are about to delete your account and all of your tasks.<br> are you sure ? <br> <br> <button onclick="deleteAll()" type="button" class="btn btn-danger">Delete All</button>`
}