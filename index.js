import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, 
    ref,
    push,
    onValue,
    remove,
    update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


const firebaseConfig = {
    databaseURL: "https://to-do-list-67494-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const tasksRef = ref(database, "tasks")

const menuIcon = document.getElementById("icons")
const menuList = document.getElementById("navmenu")
const inputEl = document.getElementById("inputEl")
const inputBtn = document.getElementById("inputBtn")
const undoneUl = document.getElementById("undone")
const doneUl = document.getElementById("done")
const taskMenu = document.getElementById("taskMenu")
const themeMenu = document.getElementById("themeMenu")
const taskLink = document.getElementById("tasksLink")
const themeLink = document.getElementById("themesLink")
const themeCont = document.getElementById("allthemes")


menuIcon.addEventListener("click", function(){
    menuList.classList.toggle("open")
})

inputBtn.addEventListener("click", function(){
    if (inputEl.value != ""){
        push(tasksRef, {
            title: inputEl.value,
            done: false
        })
        inputEl.value = ""
    }
})

function render(snapshot)
{
    const tasks = snapshot.val()
    undoneUl.innerHTML = "";
    doneUl.innerHTML = "";

    let hasDoneTask = false;
    let hasUndoneTask = false;

    for (const taskId in tasks){
        const task = tasks[taskId]
        const li = document.createElement("li")
        li.textContent = task.title
        li.dataset.id = taskId

        const deleteSpan = document.createElement("span")
        deleteSpan.textContent = "\u00d7"
        deleteSpan.classList.add("delete")
        li.appendChild(deleteSpan)

        if (task.done){
            hasDoneTask = true
            li.classList.add("checked")
            doneUl.appendChild(li)
        }
        else {
            hasUndoneTask = true
            undoneUl.appendChild(li)
        }

        if(hasUndoneTask && !hasDoneTask){
            doneUl.innerHTML = "Finish your tasks!"
        }
        if(hasDoneTask && !hasUndoneTask){
            undoneUl.innerHTML = "All tasks done!"
        }
    }
}

onValue(tasksRef, function(snapshot){
    if (snapshot.exists()){
        render(snapshot)
    }
    else {
        undoneUl.innerHTML = "Add tasks!"
        doneUl.innerHTML = "Add tasks to finish them!"
    }
})


undoneUl.addEventListener("click", function(e){
    const taskLi = e.target.closest("li")
    if(!taskLi) return;

    const taskId = taskLi.dataset.id

    if (e.target.tagName === "LI"){
        const taskRef = ref(database, `tasks/${taskId}`)
        const isDone = e.target.classList.contains("checked")
        update(taskRef, { done: !isDone})
    }
    else if (e.target.classList.contains("delete")){
        const taskRef = ref(database, `tasks/${taskId}`)
        remove(taskRef)
    }
})

doneUl.addEventListener("click", function(e){
    const taskLi = e.target.closest("li")
    if(!taskLi) return;

    const taskId = taskLi.dataset.id

    if (e.target.tagName === "LI"){
        const taskRef = ref(database, `tasks/${taskId}`)
        const isDone = e.target.classList.contains("checked")
        update(taskRef, { done: !isDone})
    }
    else if (e.target.classList.contains("delete")){
        const taskRef = ref(database, `tasks/${taskId}`)
        remove(taskRef)
    }
})

function showMenu(toshow, tohide){
    toshow.style.display = "block"
    tohide.style.display = "none"
}

taskLink.addEventListener("click", function(e){
    e.preventDefault();
    showMenu(taskMenu, themeMenu)
})

themeLink.addEventListener("click", function(e){
    e.preventDefault();
    showMenu(themeMenu, taskMenu)
})

function changeTheme(theme){
    document.documentElement.style.setProperty("--background", theme)
}

themeCont.addEventListener("click", (e) => {
    const tg = e.target
    if (tg.classList.contains("themeIcon")){
        const style = window.getComputedStyle(tg)
        const bg = style.getPropertyValue('background')
        changeTheme(bg)

        localStorage.setItem('selectedTheme', bg)
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const storedTheme = localStorage.getItem('selectedTheme')
    console.log(storedTheme)
    changeTheme(storedTheme)
})