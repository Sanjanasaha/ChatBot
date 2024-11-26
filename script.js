const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatBox=document.querySelector(".chatbox");
const chatToggler=document.querySelector(".chatbot-toggler");
const chatCloseBtn=document.querySelector(".close-btn");

let userMessage;

const API_KEY="AIzaSyCr3nk8Q_1n8CIlnLTb7pJgvkyeoKZQSp0";
//AIzaSyCr3nk8Q_1n8CIlnLTb7pJgvkyeoKZQSp0
const inputInitialHeight=chatInput.scrollHeight;

const createChatLi=(message,className)=>{
    //create a chat<li> element with passed message and className
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing"?`<p></p>`:`<span class="material-icons">
                    smart_toy
                    </span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse=(incomingChatLi)=>{
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement=incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
    };
    
    //send post req to api ,get response
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.candidates[0].content.parts[0].text;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent="Oops! Something went wrong. Please try again.";
    }).finally(()=>chatBox.scrollTo(0,chatBox.scrollHeight));
}

//candidates

const handleChat=()=>{
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputInitialHeight}px`;

    //Append user's message to the chatbox
    chatBox.appendChild(createChatLi(userMessage,"outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight);
    setTimeout(()=>{
        //Display thinking msg while waiting for the response 
        const incomingChatLi=createChatLi("Thinking...","incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0,chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    },150);
}

chatInput.addEventListener("input",()=>{
    //adjust the height of the input textarea based on its content
    chatInput.style.height=`${inputInitialHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;

});
chatInput.addEventListener("keydown",(e)=>{
    //if enter is pressed without shift key and the window 
    //width is gretaer than 800px handle the chat
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click",handleChat);
chatToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
chatCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));