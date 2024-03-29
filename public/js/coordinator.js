//This file is used for several of the coordinator pages and therefore many of the eventlisteners are encased in if-statements to check if the desired button/element
//is active on the current page being viewed

let back_btn = document.getElementById("back_btn");
let next_btn = document.getElementById("next_btn");
let unlock_btn = document.getElementById("unlock_btn");
let start_new_btn = document.getElementById("new_session_btn");
let save_btn = document.getElementById("save_btn");
let edit_btn = document.getElementById("edit_btn");
let view_btn = document.getElementById("view_btn");
let table = document.getElementById("table");

let nameGroupFormationInput = document.getElementById("name_group_formation");
let studentListInput = document.getElementById("student_list");
let topicsInput = document.getElementById("topics");
let blockedUL = document.getElementById("BlockedUL");

let AmountOfGroupMembers = document.getElementById("amountOfGroupMembers");
let AmountOfStudentPreferences = document.getElementById("studentPreferences");
let blocked = [];

let url = (window.location.pathname.split('/')[1] == 'node0') ? '/node0' : '';
let className = (window.location.pathname.split('/')[1] != 'node0') ? window.location.pathname.split('/')[1] : window.location.pathname.split('/')[2];

/**
 * This function creates a dynamic list by fetching from the server the data on the input 
 * it is used on line 300 in this file for the creation of the dynamic lists for choosing a student name for the blocked pairs
 * @param {*} input the data required for the list
 */
function createDynamicList(input) {

    fetch(url + '/search', {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            className: className,
            name: input.value
        }),
    })
    .then((response) => response.json())
    .then((data) => {

        let nameArray = data.students;

        if (input.id == 'myInput') {

            let dynalist = document.getElementById("MyDivUL");

            if (dynalist.getElementsByTagName('ul')[0]) {

                dynalist.getElementsByTagName('ul')[0].remove();

            }

            if (input.value != "") {

                let dyn = createElement('ul', { id: 'myUL' });

                for (let i in nameArray) {

                    let li = createElement('li', { class: 'item', innerText: nameArray[i] });

                    dyn.appendChild(li);

                }

                dynalist.appendChild(dyn);
                document.getElementById("myInput").setAttribute("Placeholder", "Search for names..")
                document.getElementById("myUL").addEventListener("click", function (e) {
                    if (e.target && e.target.matches("li")) {
                        document.getElementById("myInput").value = e.target.innerText; // new class name here
                        document.getElementById("myInput").setAttribute("Placeholder", "Selected");
                    }

                });
                
            }

        } else if (input.id == 'BlockedInput') {

            let dynalist2 = document.getElementById("MyDivBlockedUL");

            if (dynalist2.getElementsByTagName('ul')[0]) {

                dynalist2.getElementsByTagName('ul')[0].remove();

            }

            if (input.value != "") {

                let dyn2 = createElement('ul', { id: 'BlockedUL' });

                for (let i in nameArray) {

                    let li2 = createElement('li', { class: 'item', innerText: nameArray[i] });

                    dyn2.appendChild(li2);

                }

                dynalist2.appendChild(dyn2);
                document.getElementById("BlockedInput").setAttribute("Placeholder", "Search for names..")
                document.getElementById("BlockedUL").addEventListener("click", function (e) {
                    if (e.target && e.target.matches("li")) {
                        document.getElementById("BlockedInput").value = e.target.innerText; // new class name here
                        document.getElementById("BlockedInput").setAttribute("Placeholder", "Selected")
                    } 
                });

            }

        }
        
    });

}


if (back_btn) {
    back_btn.addEventListener("click", function () {

        window.history.back();

    })
}

//Check if the input list of students is the correct format
if (studentListInput) {
    studentListInput.addEventListener("change", function () {
        FileExtension = studentListInput.value.split(".")
        if (FileExtension[1] != "json") {
            alert("Not Json!");
            studentListInput.value = "";
        }
    })
}


if (next_btn) {
    next_btn.addEventListener("click", function (e) {

        e.preventDefault();

        //checks if all required fields are filled out and only if they are, allow to continue to next page
        if (nameGroupFormationInput.value != "" && studentListInput.value != "" && topicsInput.value != "") {

            //Saves the input data from the page in order to post it to the server and perform checks 
            const formData = new FormData();
            formData.append("nameGroupFormationInput", nameGroupFormationInput.value);
            formData.append("studentListInput", studentListInput.files[0]);
            formData.append("topicsInput", topicsInput.files[0]);

            fetch(url + '/fileGroupUpload', {
                method: "POST",
                body: formData
            })
            .then((response) => response.json())
            .then((data) => {

                if (data.error && !data.groupFormationName) {

                    alert('The inputted group formation name already exists!');

                } else if (data.error && !data.studentList) {

                    alert('The uploaded student list is not a valid JSON-file!');

                } else if (data.error && !data.topicsList) {

                    alert('The uploaded topics list is not a valid JSON-file!');

                } else if (data.error && !data.studentListJSON) {

                    alert('The student list is not the right format!');

                } else if (data.error && !data.topicsListJSON) {

                    alert('The topics list is not the right format!');

                } else {

                    window.location.href = `./${nameGroupFormationInput.value}/coordinator_config/`;

                }

            })
            .catch((err) => ("Error occured", err));

        } else {

            alert("Mandatory field(s) not filled!");

        }
    })
}

//Relocates to the pre_config page if coordinator selects to start a new group formation
if (start_new_btn) {
    start_new_btn.addEventListener("click", function () {
        window.location.href = './coordinator_preconfig';

    })
}

/**
 * This function creates a modal with the classes assigned to the currently logged in user
 * @param {*} location The location that the 'next' button will lead to
 */
function classModalCreator(location){
    fetch(url + '/getCoordinatorClasses', {
        method: "GET",})
        .then((response) => response.json())
        .then((data) => {
            //If the response is empty, assume no classes exist
            if(data == []){
                alert("No classes made for this user");
            }
            //Else, add the options to the modal
            else {
                let classesSelect = document.getElementById("classesSelect");
                classesSelect.innerHTML = "";

                document.getElementById("classesModalLabel").innerText = 'Please select class:';
                document.getElementById("classesDiv").style.display = "block";

                let element = document.createElement("option");
                element.textContent = '- select class -';
                element.disabled = true;
                element.selected = true;
          
                classesSelect.appendChild(element);

                for(var i = 0; i < data.length; i++) {

                    let opt = data[i].class ;
                    let el = document.createElement("option");
            
                    el.textContent = opt;
                    el.value = opt;
                    
                    classesSelect.appendChild(el);
            
                }

                let myModal = new bootstrap.Modal(document.getElementById('classesModal'));
                myModal.show();

                let submitBtn = document.getElementById("submit-btn");
                submitBtn.addEventListener("click", function () {
                    fetch(url + '/postCoordinatorClass', {
                        method: "POST",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                                "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            class: classesSelect.value
                        }),
                    })
                    .then((response) => response.json())
                    .then((data) => {})
                    location = "./" + classesSelect.value + location;
                    window.location.href = location;
                })
        }
    })
}

//Uses the ClassModalCreator to generate a modal for the coordinator to choose the desired class (data) to continue to next page with
if (edit_btn && view_btn){
    edit_btn.addEventListener("click", function () {
        classModalCreator('/coordinator_config');
    })
    view_btn.addEventListener("click", function () {
        classModalCreator('/coordinator_view');
    })
}

/**
 * This function is never used but I am scared to delete it
 * @param {*} myInputID 
 * @param {*} myULID 
 */
function SearchField(myInputID, myULID) {
    let input, filter, ul, li, i, txtValue;
    input = document.getElementById(myInputID);
    filter = input.value.toUpperCase();
    ul = document.getElementById(myULID);
    li = ul.getElementsByTagName('li');
    input.setAttribute("Placeholder", "Search for names..")
    ul.hidden = "";
    let count = 0;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; li.length > i; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        
        if ((txtValue.toUpperCase().indexOf(filter) > -1) && count < 10) {
            li[i].style.display = "";
            count++;
        } else {
            li[i].style.display = "none";
        }
    }
    if (input.value == "") {
        ul.hidden = "hidden";
    }

}

//if the current page is the coordinator config, a dynamic list is created for either elements myInput or BlockedInput if there is data
//th this keyword refers to the element that is currently triggering this function and creates the dynamic list for this element
if ((window.location.pathname).includes("coordinator_config")) {
    //myInput and BlockedInput are the elements of the modal on the coordinator_config page that searches for names of students to add as blocked pair
    //they are similar boxes and elements
    document.querySelectorAll("#myInput, #BlockedInput").forEach(function (element) {

        element.addEventListener("input", function () {

            createDynamicList(this);

        });

    });
}

/**
 * This functions generates the list of all blocked student pairs
 * It uses createDynamicList2 to create the list dynamically as the blocked pairs are added by the coordinator
 * If a pair is encountered that does not fulfill certain requirements, a message is returned to the user
 * @param {*} StudentA 
 * @param {*} StudentB 
 */
function BlockedList(StudentA, StudentB) {
    let blockedPair = [];
    blockedPair = new Array(2);
    blockedPair[0] = document.getElementById(StudentA).value;
    blockedPair[1] = document.getElementById(StudentB).value;
   

    if (document.getElementById(StudentA).placeholder != "Selected" || document.getElementById(StudentB).placeholder != "Selected") {
        return (alert("You have to select 2 Students!"));
    }

    if (blockedPair[0] == blockedPair[1]) {
        return (alert("You cannot block the same student"));
    }

    for (let i = 0; blocked.length > i; i++) {
        if (blockedPair[0] == blocked[i][0] || blockedPair[0] == blocked[i][1]) {
            if (blockedPair[1] == blocked[i][0] || blockedPair[1] == blocked[i][1]) {
                return (alert("Pair already exists"));
            }
        }
    }

    blocked.push(blockedPair);
    createDynamicList2(blockedPair);
}

/**
 * This function generates the table of blocked student pairs that the coordinator has saved
 * It is generated dynamically as blocked pairs are added
 * @param {*} blockedArray 
 */
function createDynamicList2(blockedArray) {
    let table = document.getElementById('MyBlockedTable').getElementsByTagName('tbody')[0];

    console.log(blockedArray);

    let row = table.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "blocked_pairs";
    checkbox.name = "blocked_pairs";
    checkbox.checked = true;
    cell1.innerHTML = blockedArray[0];
    cell2.innerHTML = blockedArray[1];
    cell3.append(checkbox);

}

//If the coordinator presses the save button, the input data from the current page is saved and posted to the server
if (save_btn) {

    save_btn.addEventListener("click", function () {

        let amountOfGroupMembers = document.getElementById("amountOfGroupMembers");
        let studentPreferences = document.getElementById("studentPreferences");
        let blockedPairArray = tableToArray(document.querySelector("table > tbody"));
        let includeRoles = document.getElementById("include_roles");

        fetch(url + '/updateClassConfig', {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                className: className,
                amountOfGroupMembers: amountOfGroupMembers.value,
                studentPreferences: studentPreferences.value,
                blockedPairArray: blockedPairArray,
                includeRoles: includeRoles
            }),
        })
            .then((response) => response.json())
            .then((data) => {

                alert('Configurations are now saved!');

            });

    });

}

//When the coordinator is ready to unlock the profile making for the students, this button is pressed
//It posts the current classname to the server that then generates the keycodes for the students
if (unlock_btn) {

    unlock_btn.addEventListener("click", function () {

        fetch(url + '/unlockClass', {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                className: className
            }),
        })
            .then((response) => response.json())
            .then((data) => {

                alert('Student profile pages are now unlocked!');

            });

    });

}

/**
 * This function generates a new HTML element with the inputs
 * @param {*} type the type of the new element
 * @param {*} props the properties of the new element
 * @returns the newly generated HTML element
 */
function createElement(type, props) {

    let element = document.createElement(type);

    for (let prop in props) {

        switch (prop) {

            case 'innerText':
                element.innerText = props[prop];
                break;
            case 'innerHTML':
                element.innerHTML = props[prop];
                break;
            default:
                element.setAttribute(prop, props[prop]);

        }

    }

    return element;

}

/**
 * Converts table to multidimensional array of objects with name and the blocks for this name
 * @param {*} table table to be converted
 * @returns multidimensional array with data from table
 */
function tableToArray(table) { 

    let array = [];
    let rows = table.children;

    for (let i = 0; i < rows.length; i++) {

        //checks if the blocked pair is unchecked, so not to be blocked, and skips this iteration if it is unchecked
        if (rows[i].children[2].getElementsByTagName('input')[0].checked == "0") {

            continue;

        }

        let fields = rows[i].children;
        let firstBlock = fields[0].innerText;
        let secondBlock = fields[1].innerText;

        let object = {};

        let firstBlockFound = array.some((element) => {

            if (element.name === firstBlock) {

                element.blocks.push(secondBlock);

                return true;

            } else {

                return false;

            }
    
        });

        if (!firstBlockFound) {

            object.name = firstBlock;

            object.blocks = [];

            object.blocks.push(secondBlock);

        }

        if (Object.keys(object).length !== 0) {

            array.push(object);

        }

        object = {};

        let secondBlockFound = array.some((element) => {

            if (element.name === secondBlock) {

                element.blocks.push(firstBlock);

                return true;

            } else {

                return false;

            }
    
        });

        if (!secondBlockFound) {

            object.name = secondBlock;

            object.blocks = [];

            object.blocks.push(firstBlock);

        }

        if (Object.keys(object).length !== 0) {

            array.push(object);

        }

    }

    return array;

}