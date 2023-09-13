// get elements
const txtEmail = document.getElementById('email');
const txtPassword = document.getElementById('password');
const btnLogin = document.getElementById('submit');
const users2 = firebase.database().ref().child("users");
var currentUser2;
var all = [];
var allKeys2 = [];
var a;
var b;

//retrieve logged in users
function user() {
    users2.on('child_added', snap => {
        allKeys2.push(snap.key);
        all.push(JSON.stringify(snap.val()));
})
}
// Add login event
if(btnLogin){
    btnLogin.addEventListener('click', function () {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => document.getElementById("error").innerHTML = e.message);
    console.log(document.getElementById("error").innerHTML);
})};
//add a realtime listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        } else {
        console.log('not logged in');
    }})
if(btnLogin){
    btnLogin.addEventListener('click', function () {
        setTimeout(function () {
                currentUser2 = firebase.auth().currentUser.email;
            alert("hi");
            alert(currentUser2);
            if (firebase.auth().currentUser) {
                if (currentUser2 == "makka@pakka.com") { }
                else {
                    var newUser = users2.push();
                    newUser.set(currentUser2);
                }
                window.location.replace("home.html");
            }
    }, 1000);        
})};
//logout function
function logout() {
    currentUser2 = firebase.auth().currentUser.email;
    if (confirm("Are you sure you want to logout?")) {
        a = all.indexOf(currentUser2) + 1;
        b = allKeys2[a];
        if (localStorage.getItem("mimer") == 0) {
            console.log(users2.child(b));
            users2.child(b).set(null);
        }
        localStorage.setItem("mimer", 0)
        firebase.auth().signOut();
        window.location.replace("index.html");
    }
    else {
        alert("Well, tough");
        alert("Nah, Just kidding");
        alert("Did you fall for it?");    
    }
}
