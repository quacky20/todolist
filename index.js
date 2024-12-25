import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, 
    ref,
    push,
    onValue,
    remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


const firebaseConfig = {
    databaseURL: "https://to-do-list-67494-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const undoneTaskRef = ref(database, "undoneTasks")
const doneTaskRef = ref(database, "doneTasks")

const menuIcon = document.getElementById("icons")
const inputEl = document.getElementById("inputEl")
const inputBtn = document.getElementById("inputBtn")

menuIcon.addEventListener("click", function(){
    menuList.classList.toggle("open")
})

inputBtn.addEventListener("click", function(){
    if (inputEl.value != ""){
        push(undoneTaskRef, inputEl.value)
        inputEl.value = ""
    }
})

let checkBox = document.getElementById("taskCheckBox")

function taskDone(){
    if (checkBox.checked != true){
        checkBox.checked = true
    }
    else{
        checkBox.checked = false
    }
    
}