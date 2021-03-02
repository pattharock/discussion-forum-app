window.onload = () => {
    let btn = document.querySelector(".question-detail .question .question-upvote button");
    let hiddenDiv = document.querySelector(".question-detail .answer-hidden");
    hiddenDiv.style.display = "none";
    btn.addEventListener("click", (event) => {
        if(hiddenDiv.style.display === "none"){
            hiddenDiv.style.display = "block";
        } else{
            hiddenDiv.style.display = "none";
        }
    })
    let textarea = document.querySelector(".question-detail .user-answer .answer-label form input[type='textarea']");
    let submit = document.querySelector(".question-detail .user-answer .answer-label form input[type='submit']");
    let cancel = document.querySelector(".question-detail .user-answer .answer-label form button");
    submit.style.display = "none";
    cancel.style.display = "none";
    textarea.addEventListener("focus",(event)=>{
        submit.style.display = "block";
        cancel.style.display = "block";
    });
    textarea.addEventListener("blur",(event)=>{
        submit.style.display = "none";
        cancel.style.display = "none";
    });
    let update = document.querySelector('.question-detail .question .question-update-form');
    update.style.display = "none";
    let hide = document.querySelector(".question-detail .edit-toggle");
    let button = document.querySelector(".question-detail .question-crud button");
    button.addEventListener("click", (event) => {
        update.style.display = "block";
        hide.style.display = "none";
    });
    update.style.display = "none";
    hide.style.display = "block";
    var title = document.querySelector(".question-detail .question .question-update-form form .title-group input");
    title.value = document.querySelector(".question-detail .question .question-description h3").innerText;
    var space = document.querySelectorAll(".question-detail .question .question-update-form form .space-group input[type='radio']");
    var spaceVal = document.querySelector(".question-detail .question .edit-toggle .question-space span").innerHTML;
    for (let i=0; i<space.length; i++){
        if(space[i].value === spaceVal){
            space[i].checked = "True";
        }
    }
    var content = document.querySelector(".question-detail .question .question-update-form form .content-group textarea");
    content.value = document.querySelector(".question-detail .question .question-description p").innerHTML;
    let cancelButton = document.querySelector("#cnclBtn");
    cancelButton.addEventListener('click',(event)=>{
        event.preventDefault();
        update.style.display = "none";
        hide.style.display = "block";
    });
};

