console.log("add task js ok")

const input = document.querySelector('#inputNewTask');
const submit= document.querySelector('#submitNewTask');
const validationMessage = document.querySelector('#validationMessage');
const errorMessage = document.querySelector('#errorMessage');
const sidebarSearch = document.querySelector('.sidebar-search');

sidebarSearch.classList.add('hidden')

submit.addEventListener('click', function() {
    const newTask = {
        description : input.value
    }

    document.querySelector('form').reset();

    const request = async (endpoint) => {
        try { 
            const response = await fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(newTask),
                    headers: {'Content-Type': 'application/json'}
                })
            const json=  await response.json()  
            if(json.errors) {
                errorMessage.style.display = "block";
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 2000)
            }
            else { 
                validationMessage.style.display = "block"; 
                setTimeout(() => {
                    validationMessage.style.display = "none";
                }, 2000)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    request('/me/newtask/add')
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
    if(json.msg) {
      alert(json.msg)
    }
    else{window.location= "/"}
  })
}


function deleteModal() {
  modal.innerHTML=`You are about to delete your account and all of your tasks.<br> are you sure ? <br> <br> <button onclick="deleteAll()" type="button" class="btn btn-danger">Delete All</button>`
}