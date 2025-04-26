
//login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

let websocket


//chat elements
const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");



const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })}


//process message from server
//function to process message from server
const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender) => {
    const div = document.createElement("div")
    const span = document.createElement("span")


    div.classList.add("message--other")
    span.classList.add("message--sender")

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const processMenssage = ({data}) => {
    const {userId, userName, content} = JSON.parse(data)

    const message = userId === user.id ?
        createMessageSelfElement(content) :
        createMessageOtherElement(content, userName)


    chatMessages.appendChild(message)

    scrollScreen()
    //scroll to bottom of chat messages
}



//user object
//id, name
const user = {id:"", name: ""};

//handle login submit
const handleLogin = (event) => {
    event.preventDefault()
    
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    
    login.style.display = "none";
    chat.style.display = "flex";
    
    websocket = new WebSocket("wss://chat-real-time-zq6f.onrender.com");
    websocket.onmessage = processMenssage;
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)


