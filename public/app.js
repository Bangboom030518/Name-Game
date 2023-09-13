// ?VARIABLES
//elements
const pickWord = document.querySelector("#word");
const addWord = document.querySelector("#add-word");
const listContainer = document.querySelector("#list-container");
const allowanceText = document.querySelector("#allowance");
const clear = document.querySelector("#clear");
const mesMots = document.querySelector("#mes-mots");
const randomWord = document.querySelector("#current-word");
const pickingContainer = document.querySelector("#picking");
const refresh = document.querySelector("#refresh");
const currentGame = document.querySelector("#current-game");
const guess = document.querySelector("#guess");
const guessingContainer = document.querySelector("#guessing-container");
const incorrect = document.querySelector("#incorrect");
//database references
const database = firebase.database();
const wordbank = database.ref().child("wordbank");
const currentName = database.ref().child("current");
const users = database.ref().child("users");
const mimer = database.ref().child("mimer");
//other variables: unassigned
var currentMimer;
var newWord;
var email;
var count2;
var randomiser2;
var index;
var randomiser;
var currentMimer;
var a2;
var b2;
var check;
//arrays
var allEmails = [];
var allEmailKeys = [];
var allKeys = [];
var allWords = [];
//other variables: assigned
localStorage.setItem("allowance", 0);
localStorage.setItem("myWords", "");
var allowance = localStorage.getItem("allowance");
var myWords = localStorage.getItem("myWords");
var count = allWords.length + 1;
var score = 0;
//?FUNCTIONS
function work() {
    //?RETRIEVE DATA
    localStorage.setItem("allowance", 0);
    localStorage.setItem("myWords", "");
    //retrieve previous data on refresh
    /*allowanceText.innerHTML = "";
    allowance = parseInt(allowance);
    if (isNaN(allowance)) { allowance = 0; };
    allowanceText.innerHTML = allowance + "/5";
    listContainer.innerHTML = myWords;
    if (allowance <= 4) { } else { mesMots.classList.add("done"); pickingContainer.classList.add("hide"); };*/
    //retrieve current user
    setTimeout(function () {
        email = JSON.stringify(firebase.auth().currentUser.email);
        console.log(email);
        //do admin stuff
        if (email == JSON.stringify("makka@pakka.com")) {
            console.log("Tu es l'admin!!!!!!");
            pickingContainer.classList.add("hide");
            mesMots.classList.add("hide");
            guessingContainer.classList.add("hide");
        }
        else {
            refresh.classList.add("hide");
            clear.classList.add("hide");
            console.log("you're not the admin");
        }
    }, 1000)
    //retrieve words
    wordbank.on('child_added', snap => {
        var currentWord = snap.key;
        allKeys.push(snap.key);
        wordbank.child(currentWord).child("name").on('value', snap => {
            allWords.push(snap.val());
            count = allWords.length + 1;
            randomiser = Math.random() * count;
            randomWord.innerHTML = allWords[Math.round(randomiser - 1)];
        })
    });
    //retrieve current word
    currentName.on('value', snap => {
        randomWord.innerHTML = snap.val();
    });
    //retrieve emails
    users.on('child_added', snap => {
        allEmailKeys.push(snap.key);
                    allEmails.push(JSON.stringify(snap.val()));
    });
    //check for mimer allocation
        mimer.on('value', snap => {
            currentMimer = snap.val();
        })
        if (email == currentMimer) {
            currentGame.classList.remove("hide");
            guessingContainer.classList.add("hide");
            localStorage.setItem("mimer", 1);
        }
        else if (email != JSON.stringify("makka@pakka.com")) {
            currentGame.classList.add("hide");
            guessingContainer.classList.remove("hide");
            if (localStorage.getItem("mimer") != 1) {
                localStorage.setItem("mimer", 0)
            }
        }
    //? BUTTON EVENT LISTENERS
    //add words
    addWord.addEventListener("click", function () {
        if (pickWord.value != "") {
            newWord = wordbank.push();
            newWord.set({
                "name": pickWord.value,
            });
            allowance = allowance + 1;
            localStorage.setItem("allowance", 0);
            listContainer.innerHTML = listContainer.innerHTML + "<li>" + pickWord.value + "</li>";
            allowanceText.innerHTML = allowance + "/5";
            pickWord.value = "";
            myWords = listContainer.innerHTML;
            localStorage.setItem("myWords", "");
            if (allowance <= 4) { } else { mesMots.classList.add("done"); }
            }
        else {
            alert("Please write something");
        }
    });
    //clear word bank
    clear.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete the entire game?")) {
            wordbank.set(null);
            allowance = 0;
            randomWord.innerHTML = "";
            mesMots.classList.remove("done");
            pickingContainer.classList.remove("hide");
            currentName.set(null);
            localStorage.setItem("allowance", allowance);
            listContainer.innerHTML = "";
            allowanceText.innerHTML = allowance + "/5";
            pickWord.value = "";
            allWords = [];
            allKeys = [];
            myWords = listContainer.innerHTML;
            localStorage.setItem("myWords", myWords);
            if (isNaN(allowance)) { allowance = 0; };
            if (email == "makka@pakka.com") {
                location.reload();
            }
        }
        else {
            alert("Well, tough");
            alert("Nah, Just kidding");
            alert("Did you fall for it?");
        }
    })
    //refresh word
    refresh.addEventListener("click", function () {
        console.log("allwords.length = " + allWords.length);
        count = allWords.length;
        console.log("count = " + count);
        randomiser = Math.random() * count;
        console.log("randomiser = " + count);
        currentName.set(allWords[Math.round(randomiser - 1)].toString());
        randomWord.innerHTML = allWords[Math.round(randomiser - 1).toString()];
        console.log("randomWord.innerHTML = " + randomWord.innerHTML);
        index = allWords.indexOf(randomWord.innerHTML);
        console.log(allWords.join("\n"));
        pickNewMimer();
    })
    //? OTHER EVENT LISTENERS
    //check for mimer allocation on body click
    document.querySelector("body").addEventListener("click", function () {
        mimer.on('value', snap => {
            currentMimer = snap.val();
        })
        if (email == currentMimer) {
            currentGame.classList.remove("hide");
            guessingContainer.classList.add("hide");
            localStorage.setItem("mimer", 1);
        }
        else if (email != JSON.stringify("makka@pakka.com")) {
            currentGame.classList.add("hide");
            guessingContainer.classList.remove("hide");
            if (localStorage.getItem("mimer") != 1) {   
                localStorage.setItem("mimer", 0)
            }
        }
    })
    //guess words
    guess.addEventListener("change", function () {
        if (randomWord.innerHTML != "") {
            if (guess.value == randomWord.innerHTML) {
                //inform success
                incorrect.innerHTML = "Wohooo, thats right!";
                //delete current mimer
                /*a2 = allEmails.indexOf(email) + 1;
                b2 = allEmailKeys[a2];
                console.log(users.child(b2));
                users.child(b2).set(null);
                allEmails = [];
                allEmailKeys = [];
                //retrieve emails again
                users.on('child_added', snap => {
                    allEmailKeys.push(snap.key);
                    allEmails.push(JSON.stringify(snap.val()));
                });*/
                //pick new mimer
                pickNewMimer()
                //pick new word
                count = allWords.length;
                console.log("count = " + count);
                randomiser = Math.random() * count;
                console.log("randomiser = " + count);
                currentName.set(allWords[Math.round(randomiser - 1)].toString());
                randomWord.innerHTML = allWords[Math.round(randomiser - 1).toString()];
                console.log("randomWord.innerHTML = " + randomWord.innerHTML);
                index = allWords.indexOf(randomWord.innerHTML);
                console.log(allWords.join("\n"));
            }
            else {
                incorrect.innerHTML = "Not quite";
            }
            //check for mimer allocation
            mimer.on('value', snap => {
                currentMimer = snap.val();
            })
            if (email == currentMimer) {
                //they are the mimer
                currentGame.classList.remove("hide");
                guessingContainer.classList.add("hide");
                localStorage.setItem("mimer", 1);
            }
            else if (email == JSON.stringify("makka@pakka.com")) {
                //they are not the mimer
                currentGame.classList.add("hide");
                guessingContainer.classList.remove("hide");
                if (localStorage.getItem("mimer") != 1) {
                    localStorage.setItem("mimer", 0)
                }
            }
        }
    })
}
//pick new mimer
function pickNewMimer() {
    count2 = allEmails.length + 1;
    randomiser2 = Math.random() * count2;
    mimer.set(JSON.parse(JSON.stringify(allEmails[Math.round(randomiser2) - 1]).toString()));
    console.log("allEmails[Math.round( " + randomiser2 + "- 1)] " + JSON.stringify(allEmails[Math.round(randomiser2) - 1]));
    mimer.on("value", snap => {
        check = snap.val()
    })
    if (check != JSON.parse(JSON.stringify(allEmails[Math.round(randomiser2) - 1]).toString())) {
        pickNewMimer();
    }
}
//fix errors in randomising word
function diagnose() {
    setTimeout(function() {
        if (randomWord.innerHTML == "undefined") {
            refresh.click();
        }    
    }, 100)
}
