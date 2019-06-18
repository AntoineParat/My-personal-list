console.log("mongoSearch js ok")

const Searchinput = document.querySelector('#search');
const divInput = document.querySelector('.autocomplete-items')

let array = []

//Search in dataBase
Searchinput.addEventListener('keyup', function(e) {
const value = e.target.value 
fetch(`/me/search?word=${value}`)
.then(resp => resp.json())
.then(json => {
    array.length = 0;
    for (let e of json) {
       array.push(e)
    }
})
.then(() => { // display results in autocomplete box
    divInput.innerHTML=''
    if (array.length > 0) {
        for (let e of array) {  
            // let div = document.createElement('div');
            // div.className ="suggestion"
            // div.setAttribute("data-toggle", "modal");
            // div.setAttribute("data-target", "#myModal");
            // div.setAttribute('data-complete', `${e.completed}`);
            let p = document.createElement('div')
            p.className ="suggestion"
            p.textContent = e.description;
            p.setAttribute('data-complete', `${e.completed}`);
            p.setAttribute("data-id", e._id)
            p.setAttribute("data-toggle", "modal");
            p.setAttribute("data-target", "#myModal");
            // div.appendChild(p)
            divInput.appendChild(p)
        }
    }
})
.catch(err => console.log(err))
})

//display selected choice in modal
const modal = document.querySelector(".modal-body")
const modalButton = document.querySelector("button.clos")

document.addEventListener('click', function(e) {
    if(e.target.className==="suggestion") {
        Searchinput.value = e.target.innerText;
       modal.innerHTML = `<p id="modalText" data-complete=${e.target.dataset.complete} data-id=${e.target.dataset.id}> ${e.target.innerText} 
       <span class="close"> <i class="far fa-trash-alt"></i> </span> </p>`
        divInput.innerHTML=''
        const modalText = document.querySelector("#modalText")
         e.target.dataset.complete === "true" ? modalText.classList.toggle("check") : ""

    }   
})

//handle modal events
modal.addEventListener("click",function(e) {
    //Delete
    if (e.target.className ==="close" || e.target.parentNode.className ==="close") {
        const id = modal.childNodes[0].dataset.id
        const toDelete = document.querySelector(`[data-id='${id}']`)
        toDelete.remove()
        modalButton.click();
    }

    //Upadate
    const update = new Promise(function(resolve){
        if (e.target.tagName === "DIV") {
            e.target.firstChild.classList.toggle("check");
            // e.target.classList.toggle("check");
            resolve()
       }
       else if (e.target.tagName === "P") {
         e.target.classList.toggle("check")
        //  e.target.parentElement.classList.toggle("check");
         resolve()
       }
    })
    .then(() => {
        const id = e.target.dataset.id || e.target.firstChild.dataset.id 
        const modalText = document.querySelector("#modalText")
        const toUpdate = document.querySelector(`[data-id='${id}']`)
        toUpdate.tagName ===  'LI' ? toUpdate.classList.toggle("checked") : "";
        fetch(`/me/task/update`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({_id : id, completed :  modalText.className==="check" ? true : false})
      })
     .then(resp => resp.json())
     .then(json => console.log(json))
     .catch(err => console.log(err))
    })
  });

 