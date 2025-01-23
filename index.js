import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyDtFWFR-w3EMw8b9e3Fcg8QtDdp3xVbJCU",
    authDomain: "to-do-list-67494.firebaseapp.com",
    databaseURL: "https://to-do-list-67494-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "to-do-list-67494",
    storageBucket: "to-do-list-67494.firebasestorage.app",
    messagingSenderId: "320192687400",
    appId: "1:320192687400:web:87ff1264c4a7819db2b41d"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const tasksRef = ref(database, "tasks")
const auth = getAuth(app)

const menuIcon = document.getElementById("icons")
const menuList = document.getElementById("navmenu")
const inputEl = document.getElementById("inputEl")
const inputBtn = document.getElementById("inputBtn")
const undoneUl = document.getElementById("undone")
const doneUl = document.getElementById("done")
const taskMenu = document.getElementById("taskMenu")
const themeMenu = document.getElementById("themeMenu")
const accMenu = document.getElementById("accMenu")
const taskLink = document.getElementById("tasksLink")
const themeLink = document.getElementById("themesLink")
const accLink = document.getElementById("accLink")
const themeCont = document.getElementById("allthemes")

const loginHead = document.getElementById("loginHead");
const submitButton = document.getElementById("submitbutton");
const registerLink = document.getElementById("reg");
const registerToggle = document.getElementById("register");
const rememberForget = document.getElementById("remember-forget");
const confirmPassInput = document.getElementById("confirmPassIn");
const forgotPassword = document.getElementById("forgot")

const authPage = document.getElementById("auth-Page")
const profilePage = document.getElementById("profile-page")
const userEmailspan = document.getElementById("userEmail")
const logOut = document.getElementById("logOut")
const resetPass = document.getElementById("resetPassword")

onAuthStateChanged(auth, (user)=> {
    if (user) {
        authPage.style.display = "none";
        profilePage.style.display = "block";

        userEmailspan.textContent = user.email;
    }
    else{
        authPage.style.display = "block";
        profilePage.style.display = "none";
    }
})

logOut.addEventListener("click", ()=>{
    signOut(auth)
    .then(()=>{
        alert("Logged Out Successfully!")
    })
    .catch((error)=>{
        const errorMessage = error.message;
        alert(errorMessage);
    })
})

resetPass.addEventListener("click", ()=>{
    const email = auth.currentUser.email
    sendPasswordResetEmail(auth, email)
    sendPasswordResetEmail(auth, email)
    .then(()=>{
        alert("A password reset link has been sent to your email")
    })
    .catch((error)=>{
        const errorMessage = error.message;
        alert(errorMessage);
    })
})

function resetPassword(){
    const email = document.getElementById("userIn").value
    sendPasswordResetEmail(auth, email)
    .then(()=>{
        alert("A password reset link has been sent to your email")
    })
    .catch((error)=>{
        const errorMessage = error.message;
        alert(errorMessage);
    })
}

forgotPassword.addEventListener('click', resetPassword)

function toggleAuthMode() {
    const isLogin = loginHead.querySelector("span").textContent === "LOGIN"; 

    loginHead.querySelector("span").textContent = isLogin ? "REGISTER" : "LOGIN"; 

    submitButton.value = isLogin ? "Register" : "Login"; 

    registerToggle.innerHTML = isLogin
        ? `Already have an account? <a href="#" id="reg">Login</a>`
        : `Don't have an account? <a href="#" id="reg">Register</a>`;

    confirmPassInput.parentElement.style.display = isLogin ? "block" : "none";

    rememberForget.style.display = isLogin ? "none" : "flex";

    const newRegisterLink = document.querySelector("#register a");
    newRegisterLink.addEventListener("click", toggleAuthMode);
}


registerLink.addEventListener("click", function (event) {
    event.preventDefault();
    toggleAuthMode();
});

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.getElementById("userIn").value;
    const password = document.getElementById("passIn").value;
    const confirmPassword = document.getElementById("confirmPassIn").value;
    const isLogin = loginHead.querySelector("span").textContent === "LOGIN";

    console.log('Confirm Password:', confirmPassword);
    console.log('isLogin:', isLogin);

    if (isLogin) {
        // Login Mode
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                location.reload();
                alert("Login Successful!");
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
    } else {
        // Register Mode
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    location.reload();
                    alert("Account Created!");
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        }
    }
});

const allMenus = [taskMenu, themeMenu, accMenu]

menuIcon.addEventListener("click", function () {
    menuList.classList.toggle("open")
})

inputBtn.addEventListener("click", function () {
    if (inputEl.value != "") {
        push(tasksRef, {
            title: inputEl.value,
            done: false
        })
        inputEl.value = ""
    }
})

function render(snapshot) {
    const tasks = snapshot.val()
    undoneUl.innerHTML = "";
    doneUl.innerHTML = "";

    let hasDoneTask = false;
    let hasUndoneTask = false;

    for (const taskId in tasks) {
        const task = tasks[taskId]
        const li = document.createElement("li")
        li.textContent = task.title
        li.dataset.id = taskId

        const deleteSpan = document.createElement("span")
        deleteSpan.textContent = "\u00d7"
        deleteSpan.classList.add("delete")
        li.appendChild(deleteSpan)

        if (task.done) {
            hasDoneTask = true
            li.classList.add("checked")
            doneUl.appendChild(li)
        }
        else {
            hasUndoneTask = true
            undoneUl.appendChild(li)
        }
    }
    if (hasUndoneTask && !hasDoneTask) {
        doneUl.innerHTML = "Finish your tasks!"
    }
    if (hasDoneTask && !hasUndoneTask) {
        undoneUl.innerHTML = "All tasks done!"
    }
}

onValue(tasksRef, function (snapshot) {
    if (snapshot.exists()) {
        render(snapshot)
    }
    else {
        undoneUl.innerHTML = "Add tasks!"
        doneUl.innerHTML = "Add tasks to finish them!"
    }
})


undoneUl.addEventListener("click", function (e) {
    const taskLi = e.target.closest("li")
    if (!taskLi) return;

    const taskId = taskLi.dataset.id

    if (e.target.tagName === "LI") {
        const taskRef = ref(database, `tasks/${taskId}`)
        const isDone = e.target.classList.contains("checked")
        update(taskRef, { done: !isDone })
    }
    else if (e.target.classList.contains("delete")) {
        const taskRef = ref(database, `tasks/${taskId}`)
        remove(taskRef)
    }
})

doneUl.addEventListener("click", function (e) {
    const taskLi = e.target.closest("li")
    if (!taskLi) return;

    const taskId = taskLi.dataset.id

    if (e.target.tagName === "LI") {
        const taskRef = ref(database, `tasks/${taskId}`)
        const isDone = e.target.classList.contains("checked")
        update(taskRef, { done: !isDone })
    }
    else if (e.target.classList.contains("delete")) {
        const taskRef = ref(database, `tasks/${taskId}`)
        remove(taskRef)
    }
})

function showMenu(toshow, mode) {
    allMenus.forEach(menu => {
        if (menu === toshow) {
            menu.style.display = mode
        }
        else {
            menu.style.display = "none"
        }
    })
}

taskLink.addEventListener("click", function (e) {
    e.preventDefault();
    showMenu(taskMenu, "block")
})

themeLink.addEventListener("click", function (e) {
    e.preventDefault();
    showMenu(themeMenu, "block")
})

accLink.addEventListener("click", function (e) {
    e.preventDefault();
    showMenu(accMenu, "flex")
})

function changeTheme(theme) {
    document.documentElement.style.setProperty("--background", theme)
}

themeCont.addEventListener("click", (e) => {
    const tg = e.target
    if (tg.classList.contains("themeIcon")) {
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