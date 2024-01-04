let root = document.getElementById("root");
let indexStart;
let indexEnd;
let temp1;
let nodes;
let subNodes;
let subindexStart;
let subindexEnd;
let todoListArray = [];
//Tasks to do 12/28- made sure to reindex after deletion and swap sublists
class todoList{
    constructor(place, title = "to-do list"){

        this.place = place;
        this.title = title;
        this.cardArray = [];
        this.index = todoListArray.length;

        this.render();
        todoListArray.push(this)
        this.index = todoListArray.indexOf(this) + 1

    }

    addToDo(){
        let text = this.input.value;
        this.cardArray.push(new Card(text, this.div, this));
    }

    render(){
        this.createToDoListElement();
        this.place.append(this.todoListElement);

        this.todoListElement.draggable = true;
        this.todoListElement.addEventListener('dragstart', () => {
            var parentOfFill = this.todoListElement.parentNode;
            indexStart = todoListArray.indexOf(this)
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

              //changing labeled column number after swap
              for (var lis of todoListArray) {
                lis.index = todoListArray.indexOf(lis) + 1;
                lis.todoListElement.childNodes[1].innerText = lis.index
            }
              //Update the index in the subtasks after the swaps
              var subIndex = 1;
              for (var ca of todoListArray[indexStart].cardArray) {
                ca.card.childNodes[0].innerText = (indexStart+1).toString() + "." + (subIndex).toString();
                subIndex += 1;
              }
              subIndex = 1;
              //console.log(this.todoListElement.parent.children[indexEnd])
              for (var ca of todoListArray[indexEnd].cardArray) {
                ca.card.childNodes[0].innerText = (indexEnd+1).toString() + "." + (subIndex).toString();
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
                var temp = todoListArray[indexStart]
                todoListArray[indexStart] = todoListArray[indexEnd];
                todoListArray[indexEnd] = temp;
                todoListArray[indexStart].index = indexEnd
                todoListArray[indexEnd].index = indexStart
            }
            if (indexEnd < indexStart) {
                this.todoListElement.parentNode.insertBefore(temp1, this.todoListElement.parentNode.childNodes[indexEnd])
                this.todoListElement.parentNode.insertBefore(temp2, this.todoListElement.parentNode.childNodes[indexStart + 1])
                var temp = todoListArray[indexStart]
                todoListArray[indexStart] = todoListArray[indexEnd];
                todoListArray[indexEnd] = temp;
                todoListArray[indexStart].index = indexEnd
                todoListArray[indexEnd].index = indexStart
            }
        })
        var numb = document.createElement('h2');
        numb.innerText = (this.index + 1).toString()
        
        let deleteButton = document.createElement('button');
        deleteButton.innerText = "X";
        deleteButton.classList.add("todoList-delete")
        deleteButton.addEventListener('click', ()=>{
            this.place.removeChild(this.todoListElement);
            todoListArray.splice(todoListArray.indexOf(this), 1);
            for (var lis of todoListArray) {
                lis.index = todoListArray.indexOf(lis) + 1;
                lis.todoListElement.childNodes[1].innerText = lis.index
                for (var subter of lis.cardArray) {
                    subter.card.childNodes[0].innerText = (lis.index).toString() + "." + (subter.index).toString();
                }
            }
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
        this.index = this.todoList.cardArray.length + 1
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
        this.h3.innerText = (this.todoList.index).toString() + "."+(this.index).toString()

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
            console.log("cardi",this.todoList.cardArray)
            subindexStart = this.todoList.cardArray.indexOf(this);
            setTimeout(() => {
                return (this.card.style.visibility = "hidden");
            }, 0);
            this.card.classList.add("dragging")
        })

        this.card.addEventListener('dragend', (e) => {
            e.stopPropagation();
            var parentOfFill = this.card.parentNode;
            if (this.card.style.visibility === "hidden") {
                this.card.style.visibility = "visible";
              }
              this.card.classList.remove("dragging")

              //changing labeled subtask number after swap
              for (var lis of this.todoList.cardArray) {
                lis.index = this.todoList.cardArray.indexOf(lis) + 1;
                console.log("Family memories", lis.parentNode);
                lis.card.childNodes[0].innerText = (this.todoList.index).toString() + "." + (lis.index).toString();
              }
        })
        
        this.card.addEventListener(
            "dragover",
            (event) => {
              // prevent default to allow drop
              event.stopPropagation();
              event.preventDefault();
            },
            false,
          );

        this.card.addEventListener('drop', (e) => {
            e.stopPropagation();
            e.preventDefault()
            temp1 = this.card.parentNode.childNodes[subindexStart];
            subindexEnd = this.todoList.cardArray.indexOf( this);
            var temp2 = this.card.parentNode.childNodes[subindexEnd]
            if (subindexStart < subindexEnd) {
                this.card.parentNode.insertBefore(temp1, this.card.parentNode.childNodes[subindexEnd])
                this.card.parentNode.insertBefore(temp2, this.card.parentNode.childNodes[subindexStart])
                var temy = this.todoList.cardArray[subindexStart]
                this.todoList.cardArray[subindexStart] = this.todoList.cardArray[subindexEnd];
                this.todoList.cardArray[subindexEnd] = temy;
                this.todoList.cardArray[subindexStart].index = subindexStart
                this.todoList.cardArray[subindexEnd].index = subindexEnd
            }
            if (subindexEnd < subindexStart) {
                this.card.parentNode.insertBefore(temp1, this.card.parentNode.childNodes[subindexEnd])
                this.card.parentNode.insertBefore(temp2, this.card.parentNode.childNodes[subindexStart + 1])
                var temy = this.todoList.cardArray[subindexStart]
                this.todoList.cardArray[subindexStart] = this.todoList.cardArray[subindexEnd];
                this.todoList.cardArray[subindexEnd] = temy;
                this.todoList.cardArray[subindexStart].index = subindexStart
                this.todoList.cardArray[subindexEnd].index = subindexEnd
            }
        })
        
        this.place.append(this.card);
    }

    deleteCard(){
        this.card.remove();
        let i = this.todoList.cardArray.indexOf(this);
        this.todoList.cardArray.splice(i,1);
        for (var subter of this.todoList.cardArray) {
            subter.index = this.todoList.cardArray.indexOf(subter) + 1
            subter.card.childNodes[0].innerText = (this.todoList.index).toString() + "." + (subter.index).toString();
        }
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

document.addEventListener('keypress',(e)=>{
{
    if (e.key === "Enter") {
        e.preventDefault();
        if ( addTodoListInput.value.trim() != ""){
            new todoList(root, addTodoListInput.value);
            addTodoListInput.value = "";
        }
    }
    }
 });



// let todoList1 = new todoList(root);
// let todoList2 = new todoList(root);
// let todoList3 = new todoList(root);



// todoList1.input.value = "asdasds";
// todoList1.addToDo();
