let root = document.getElementById("root");
let indexStart;
let indexEnd;
let temp1;
let nodes;
let subNodes;
let subindexStart;
let subindexEnd
//Tasks to do 12/28- made sure to reindex after deletion and swap sublists
class todoList{
    constructor(place, title = "to-do list"){

        this.place = place;
        this.title = title;
        this.cardArray = [];

        this.render();
        for (var list of this.place.childNodes) {
            //console.log(list)
        }
    }

    addToDo(){
        let text = this.input.value;
        var index = 0;
        nodes = Array.prototype.slice.call( this.place.children );
        index = nodes.indexOf( this.todoListElement );
        this.index = index
        this.cardArray.push(new Card(text, this.div, this));
    }

    render(){
        this.createToDoListElement();
        this.place.append(this.todoListElement);
        nodes = Array.prototype.slice.call( this.place.children );
        var index = 0;
        index = nodes.indexOf( this.todoListElement );
        /*this.todoListElement.addEventListener('click', ()=>{
            //this.place.removeChild(this.todoListElement);
            index = nodes.indexOf( this.todoListElement );
                
           });*/
        this.index = index;
        this.todoListElement.draggable = true;
        this.todoListElement.addEventListener('dragstart', () => {
            var parentOfFill = this.todoListElement.parentNode;
            nodes = Array.prototype.slice.call( this.todoListElement.parentNode.children );
            indexStart = nodes.indexOf( this.todoListElement);
            temp1 = this.todoListElement.parentNode.childNodes[indexStart]
            setTimeout(() => {
                return (this.todoListElement.style.visibility = "hidden");
            }, 0);
            this.todoListElement.classList.add("dragging")
        })

        this.todoListElement.addEventListener('dragend', () => {
            var parentOfFill = this.todoListElement.parentNode;
            if (this.todoListElement.style.visibility === "hidden") {
                this.todoListElement.style.visibility = "visible";
              }
              this.todoListElement.classList.remove("dragging")
              var indexTemp = 1

              //changing labeled column number after swap
              for (var thisNode of this.todoListElement.parentNode.children) {
                thisNode.childNodes[1].innerText = indexTemp;
                indexTemp += 1;
              }
              //Update the index in the subtasks after the swaps
              var subIndex = 1;
              for (var card of this.todoListElement.parentNode.children[indexStart].querySelectorAll(".card")) {
                card.childNodes[0].innerText = (indexStart+1).toString() + "." + (subIndex).toString();
                subIndex += 1;
              }
              subIndex = 1;
              console.log(this.todoListElement.parentNode.children[indexEnd])
              for (var card of this.todoListElement.parentNode.children[indexEnd].querySelectorAll(".card")) {
                card.childNodes[0].innerText = (indexEnd+1).toString() + "." + (subIndex).toString();
                subIndex += 1;
              }
        })
        
        this.todoListElement.addEventListener(
            "dragover",
            (event) => {
              // prevent default to allow drop
              event.preventDefault();
            },
            false,
          );

        this.todoListElement.addEventListener('drop', (e) => {
            e.preventDefault()
            nodes = Array.prototype.slice.call( this.todoListElement.parentNode.children );
            indexEnd = nodes.indexOf( this.todoListElement);
            var temp2 = this.todoListElement.parentNode.childNodes[indexEnd]
            if (indexStart < indexEnd) {
                this.todoListElement.parentNode.insertBefore(temp1, this.todoListElement.parentNode.childNodes[indexEnd])
                this.todoListElement.parentNode.insertBefore(temp2, this.todoListElement.parentNode.childNodes[indexStart])
            }
            if (indexEnd < indexStart) {
                this.todoListElement.parentNode.insertBefore(temp1, this.todoListElement.parentNode.childNodes[indexEnd])
                this.todoListElement.parentNode.insertBefore(temp2, this.todoListElement.parentNode.childNodes[indexStart + 1])
            }
        })
        var numb = document.createElement('h2');
        numb.innerText = (index + 1).toString()
        this.index = index;
        
        let deleteButton = document.createElement('button');
        deleteButton.innerText = "X";
        deleteButton.classList.add("todoList-delete")
        deleteButton.addEventListener('click', ()=>{
            this.place.removeChild(this.todoListElement);
        });

        this.todoListElement.prepend(numb);
        this.todoListElement.prepend(deleteButton);
    }

    createToDoListElement(){
        //Create elements
        this.h2 = document.createElement('h2');
        this.h2.innerText = this.title;
        this.input = document.createElement('input');
        this.input.classList.add("comment");
        this.button = document.createElement('button');
        this.button.innerText = 'Add';
        this.button.classList.add("btn-save");
        this.button.id = "to-do-list-button";
        this.div = document.createElement('div');
        this.todoListElement = document.createElement('div');

        //Add Event listener
        this.button.addEventListener('click', ()=>{
            if(this.input.value != ""){
                this.addToDo.call(this);
                this.input.value = "";
            }
        });

        this.input.addEventListener('keypress', (e)=>{
            if (e.key==='Enter') {
                if(this.input.value != ""){
                    this.addToDo.call(this);
                    this.input.value = "";
                }
            }
        });

        //Append elements to the to-do list element
        this.todoListElement.append(this.h2);
        this.todoListElement.append(this.input);
        this.todoListElement.append(this.button);
        this.todoListElement.append(this.div);
        this.todoListElement.classList.add("todoList");
    }
}


class Card{
    constructor(text, place, todoList){

        this.place = place;
        this.todoList = todoList;
        this.state = {
            text: text,
            description: "Click to write a description...",
            comments: []
        }
        this.render();
    }

    render(){
        this.card = document.createElement('div');
        this.card.classList.add("card");
        this.card.addEventListener('click', (e)=>{
            if(e.target != this.deleteButton){
                this.showMenu.call(this);
            }
        });
        this.h3 = document.createElement('h3')
        this.h3.innerText = (this.todoList.index+1).toString() + "."+(this.todoList.cardArray.length + 1).toString()

        this.p = document.createElement('p');
        this.p.innerText = this.state.text;

        this.deleteButton = document.createElement('button');
        this.deleteButton.innerText = "X";
        this.deleteButton.addEventListener('click', ()=>{
            this.deleteCard.call(this);
        });

        this.card.append(this.h3)
        this.card.append(this.p);
        this.card.append(this.deleteButton);

        this.card.draggable = true;
        this.card.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            var parentOfFill = this.card.parentNode;
            subNodes = Array.prototype.slice.call( this.card.parentNode.children );
            subindexStart = subNodes.indexOf( this.card);
            temp1 = this.card.parentNode.childNodes[subindexStart]
            setTimeout(() => {
                return (this.card.style.visibility = "hidden");
            }, 0);
            this.card.classList.add("dragging")
        })

        this.card.addEventListener('dragend', () => {
            var parentOfFill = this.card.parentNode;
            if (this.card.style.visibility === "hidden") {
                this.card.style.visibility = "visible";
              }
              this.card.classList.remove("dragging")
              var indexTemp = 1

              //changing labeled subtask number after swap
              for (var thisNode of this.card.parentNode.children) {
                thisNode.childNodes[0].innerText = (this.todoList.index+1).toString() + "."+ indexTemp;
                indexTemp += 1;
              }
        })
        
        this.card.addEventListener(
            "dragover",
            (event) => {
              // prevent default to allow drop
              event.preventDefault();
            },
            false,
          );

        this.card.addEventListener('drop', (e) => {
            e.preventDefault()
            subNodes = Array.prototype.slice.call( this.card.parentNode.children );
            subindexEnd = subNodes.indexOf( this.card);
            var temp2 = this.card.parentNode.childNodes[subindexEnd]
            if (subindexStart < subindexEnd) {
                this.card.parentNode.insertBefore(temp1, this.card.parentNode.childNodes[subindexEnd])
                this.card.parentNode.insertBefore(temp2, this.card.parentNode.childNodes[subindexStart])
            }
            if (subindexEnd < subindexStart) {
                this.card.parentNode.insertBefore(temp1, this.card.parentNode.childNodes[subindexEnd])
                this.card.parentNode.insertBefore(temp2, this.card.parentNode.childNodes[subindexStart + 1])
            }
        })
        
        this.place.append(this.card);
    }

    deleteCard(){
        this.card.remove();
        let i = this.todoList.cardArray.indexOf(this);
        this.todoList.cardArray.splice(i,1);
    }

    showMenu(){

        //Create elements
        this.menu = document.createElement("div");
        this.menuContainer = document.createElement("div");
        this.menuTitle = document.createElement("div");
        this.menuDescription = document.createElement("div");
        this.commentsInput = document.createElement("input");
        this.commentsButton = document.createElement('button');
        this.menuComments = document.createElement("div");


        //Add class names
        this.menu.className = "menu";
        this.menuContainer.className = "menuContainer";
        this.menuTitle.className = "menuTitle";
        this.menuDescription.className = "menuDescription";
        this.menuComments.className = "menuComments";
        this.commentsInput.className = "commentsInput comment";
        this.commentsButton.className = "commentsButton btn-save";

        //Add inner Text
        this.commentsButton.innerText = "Add";
        this.commentsInput.placeholder = "Write a comment...";

        //Event listeners
        this.menuContainer.addEventListener('click', (e)=>{
            console.log(e.target);
            if(e.target.classList.contains("menuContainer")){
                this.menuContainer.remove();
            }
        });
        
        this.commentsButton.addEventListener('click', ()=>{
            if(this.commentsInput.value != ""){
            this.state.comments.push(this.commentsInput.value);
            this.renderComments();
            this.commentsInput.value = "";
            }
        })

        //Append
        this.menu.append(this.menuTitle);
        this.menu.append(this.menuDescription);
        this.menu.append(this.commentsInput);
        this.menu.append(this.commentsButton);
        this.menu.append(this.menuComments);
        this.menuContainer.append(this.menu);
        root.append(this.menuContainer);

        this.editableDescription = new EditableText(this.state.description, this.menuDescription, this, "description", "textarea");
        this.editableTitle = new EditableText(this.state.text, this.menuTitle, this, "text", "input");
        
        this.renderComments();
    }

    renderComments(){

        let currentCommentsDOM = Array.from(this.menuComments.childNodes);

        currentCommentsDOM.forEach(commentDOM =>{
            commentDOM.remove();
        });

        this.state.comments.forEach(comment =>{
            new Comment(comment, this.menuComments, this);
        });
    }
}

class EditableText{
    constructor(text, place, card, property, typeOfInput){
        this.text = text;
        this.place = place;
        this.card = card;
        this.property = property;
        this.typeOfInput = typeOfInput;
        this.render();
    }

    render(){
        this.div = document.createElement("div");
        this.p = document.createElement("p");

        this.p.innerText = this.text;

        this.p.addEventListener('click', ()=>{
            this.showEditableTextArea.call(this);
        });

        this.div.append(this.p);
        this.place.append(this.div);
    }

    showEditableTextArea(){
        let oldText = this.text;

        this.input = document.createElement(this.typeOfInput);
        this.saveButton = document.createElement("button");

        this.p.remove();
        this.input.value = oldText;
        this.saveButton.innerText = "Save";
        this.saveButton.className = "btn-save";
        this.input.classList.add("comment");

        this.saveButton.addEventListener('click', ()=>{
            this.text = this.input.value;
            this.card.state[this.property] = this.input.value;
            if(this.property == "text"){
                this.card.p.innerText = this.input.value;
            }
            this.div.remove();
            this.render();
        });

        function clickSaveButton(event, object){
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                object.saveButton.click();
              }
        }

        this.input.addEventListener("keyup", (e)=>{
            if(this.typeOfInput == "input"){
                clickSaveButton(e, this);
            }
        });

        this.div.append(this.input);

        if(this.typeOfInput == "textarea"){
            this.div.append(this.saveButton);
        }

        this.input.select();
    }

}

class Comment{
    constructor(text, place, card){
        this.text = text;
        this.place = place;
        this.card = card;
        this.render();
    }

    render(){
        this.div = document.createElement('div');
        this.div.className = "comment";
        this.div.innerText = this.text;
        
        this.place.append(this.div);
    }
}



//-------------main------------

let addTodoListInput = document.getElementById("addTodoListInput");
let addTodoListButton = document.getElementById("addTodoListButton");

addTodoListButton.addEventListener('click',()=>{
   if ( addTodoListInput.value.trim() != ""){
    new todoList(root, addTodoListInput.value);
    addTodoListInput.value = "";
   }
});

addTodoListButton.addEventListener('keypress',(e)=>{
{
        if ( addTodoListInput.value.trim() != ""){
            new todoList(root, addTodoListInput.value);
            addTodoListInput.value = "";
        }
    }
 });



// let todoList1 = new todoList(root);
// let todoList2 = new todoList(root);
// let todoList3 = new todoList(root);



// todoList1.input.value = "asdasds";
// todoList1.addToDo();
