
window.onload = () => {
    var ansLink = document.querySelectorAll(".question .question-bottom .ans-btn");
    var answerBlocks = document.querySelectorAll(".ans-block .answer-hidden");
    for(let i=0; i<answerBlocks.length; i++){
        answerBlocks[i].style.display = "none";
    }
    for (let i=0; i<ansLink.length; i++){
        ansLink[i].addEventListener("click", (event) => {
            if (answerBlocks[i].style.display === "none"){
                answerBlocks[i].style.display = "block";
                for (let k=0; k<ansLink.length; k++){
                    if(k !== i){
                        answerBlocks[k].style.display = "none";
                    }
                }
            } else{
                answerBlocks[i].style.display = "none";
            }
        })
    }
    let upvotes = document.querySelectorAll(".question-bottom a");
    console.log(upvotes);
    for(let i=0; i<upvotes.length; i++){
        upvotes[i].addEventListener("click", (event) => {
            if(upvotes[i].style.fontWeight === "normal"){
                upvotes[i].style.fontWeight = "bold";
            } else {
                upvotes[i].style.fontWeight = "normal";
            }
        });
    }
    function isOverflown(element) {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }
    let elems = document.querySelectorAll('.home .content .question .question-flex .question-right p');
    let parents = document.querySelectorAll(".home .content .question .question-flex .question-right");
    for (let i=0; i<elems.length; i++){
        if(isOverflown(elems[i])){
            elems[i].style.overflow = "hidden";
        }
    }
    for(let i=0; i<elems.length; i++){
        if(isOverflown(elems[i])){
            let e = parents[i].appendChild(document.createElement('button'));
            e.innerText = "Read More";
            e.addEventListener('click', (event) => {
                if(elems[i].style.overflow === "hidden"){
                    elems[i].style.overflow = "auto";
                    elems[i].style.height = "auto";
                    e.innerText = "Read Less";
                } else{
                    elems[i].style.height = "4.8rem";
                    elems[i].style.overflow = "hidden";
                    e.innerText = "Read More";
                }
            });
        }
    }
    let hot = document.querySelector(".home .header ul li button#sortByUp");
    hot.addEventListener('click', (event) => {
        let qdivs = document.querySelectorAll(".home .content .question");
        let upvotes = []
        let qdivids = []
        let ansblocks = document.querySelectorAll(".home .content .ans-block");
        let ansdivids = []
        for (let i=0; i<qdivs.length; i++){
            upvotes[i]=Number(qdivs[i].lastChild.firstChild.firstChild.innerHTML.slice(7, 8))
            qdivids[i] = qdivs[i].id;
            ansdivids[i] = ansblocks[i].id
        }
        for (let i=0; i<upvotes.length; i++){
            for (let j=0; j<upvotes.length; j++){
                if(upvotes[j]<upvotes[j+1]){
                    let temp = upvotes[j];
                    upvotes[j] = upvotes[j+1];
                    upvotes[j+1] = temp;

                    let tempid = qdivids[j];
                    qdivids[j] = qdivids[j+1];
                    qdivids[j+1] = tempid;

                    let tempansid = ansdivids[j];
                    ansdivids[j] = ansdivids[j+1];
                    ansdivids[j+1] = tempansid;

                }
            }
        }
        let container = document.querySelector('.home .content .content-questions');
        container.innerHTML = "";
        for (i=0; i<qdivids.length; i++){
            let ids = qdivids[i];
            for (let j=0; j<qdivs.length; j++){
                if(qdivs[j].id === ids){
                    container.appendChild(qdivs[j]);
                    container.appendChild(ansblocks[j])
                }
            }
        }
    });
    let search = document.querySelector(".home .header #searchBar");
    let quesTitleList = document.querySelectorAll(".home .content .question .question-flex .question-right h3 a");
    let quesList = document.querySelectorAll(".home .content .question");
    search.addEventListener("input", (event) => {
        let query = search.value.toLowerCase();
        for(let i=0; i<quesTitleList.length; i++){
            if (quesTitleList[i].innerHTML.toLowerCase().includes(query)){
                quesList[i].style.display = "block";
            } else{
                quesList[i].style.display = "none";
            }
        }
    });
    search.addEventListener("blur", (event) => {
        if(search.value === ""){
            for(let i=0; i<quesList.length; i++){
                quesList[i].style.display = "block";
            }
        }
    });
};

