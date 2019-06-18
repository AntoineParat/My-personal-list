//https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg
console.log("js /me ok");
const currentPage = document.querySelector("#currentPage");
const totalPage = document.querySelector("#totalPage");
const currentTasks = document.querySelector("#currentTasks");
const totalTasks = document.querySelector("#totalTasks");
const mainUl = document.querySelector(".mainUL");
const loader = document.querySelector("#loader");

/* JS FOR FETCH AND DISPLAY ALL TASKS*/

let page = 0;
let totalOfPage= '';
//let totalDoc = ''

//Fetching the total of pages
fetch(`/tasks/all/count?sort=all`)
.then(resp => resp.json())
.then(respParsed => {
  totalOfPage = respParsed.totalPage;
  totalPage.innerText = totalOfPage;
  //totalDoc = respParsed.count
})
.then(() => getAllTasks(1))


function getAllTasks(x) {
  loader.classList.toggle("hidden");
  if (x === 1 && page < totalOfPage) {
    page ++
  }
  else if (x===0 && page > 1) { // Prevent page counter from going alone
    page -= 1
  }
  fetch(`/tasks/all?sort=all&page=${page}`)
  .then(resp => resp.json())
  .then(respParsed => { 
    mainUl.innerHTML=''
    //Adding Pagination
    //currentTasks.innerText = respParsed.currentDoc;
    //totalTasks.innerText = totalDoc;
    currentPage.innerText = page;
    
    //Adding list of tasks
    loader.classList.toggle("hidden");
    for (let e of respParsed.tasks) {
      let li = document.createElement("li");
      li.setAttribute("data-id", e._id);
      mainUl.appendChild(li);
      let text = document.createElement('p')
      text.textContent = e.description;
      // Create a "close" button and append it to each list item
      let span = document.createElement("SPAN");
      span.className = "close";
      span.innerHTML = '<i class="far fa-trash-alt"></i>'
      li.appendChild(text);
      li.appendChild(span)
      if(e.completed === true) {
        li.classList.toggle("checked");
        text.classList.toggle("checked");
      }
    }
  })
  .then(() => {
   const close = document.querySelectorAll(".mainUL LI .close");
    for (let element of close) {
      element.onclick = function() {
        var div = this.parentElement;
       div.remove()
      };
    }
  })
  .catch(error => console.log(error));
}


//Add a "checked" symbol when clicking on a list item
// const list = document.querySelector(".mainUL");

mainUl.addEventListener("click",function(e) {
    if (e.target.tagName === "LI") {
         e.target.classList.toggle("checked");
         e.target.firstChild.classList.toggle("checked");
    }
    else if (e.target.tagName === "P") {
      e.target.parentNode.classList.toggle("checked")
      e.target.classList.toggle("checked")
    }
  },
  false
);

/*DELETE TASK*/
document.addEventListener('click', function(e) {
  if(e.target.className ==="close"|| e.target.parentNode.className ==="close" ) { 
    const id = e.target.parentElement.dataset.id || e.target.parentElement.parentElement.dataset.id
    fetch(`/me/delete/task`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ _id : id} )
    })
    .then( (resp) =>  resp.json())
    .then(json => console.log(json))
  
  }
})

/*UPDATE TASKS*/


mainUl.addEventListener('click', function(e) { 
  if(e.target.dataset.id || e.target.parentElement.dataset.id) { 
    const id = e.target.dataset.id || e.target.parentElement.dataset.id 
    fetch(`/me/task/update`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id : id, completed :  e.target.className==="checked" ? true : false})
    })
   .then(resp => resp.json())
   .then(json => console.log(json))
   .catch(err => console.log(err))
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
    if(json.msg) {
      alert(json.msg)
    }
    else{window.location= ""}
  })
}


function deleteModal() {
  modal.innerHTML=`You are about to delete your account and all of your tasks.<br> are you sure ? <br> <br> <button onclick="deleteAll()" type="button" class="btn btn-danger">Delete All</button>`
}