// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
/* global $*/

function myFunctionPeople() {
    var input, filter, ul, li, a, i, showAdd;
    var available = 0;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    showAdd = document.getElementById("showAdd");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            available += 1;
        } else {
            li[i].style.display = "none";
        }
    }
    if (available > 0) {
        showAdd.style.display = "none";
    } else {
        showAdd.style.display = "";
    }
}

function addPerson() {
    var person_id;
    var name = document.getElementById("myInput").value;
    console.log('addPerson:' + name );
    // Now create a person record in the database using ajax
    $.ajax({
        type: 'POST',
        url: "people",
        data: {
            person: {
                name: name
            }
        },
        dataType: 'json',
        success: function(data){
            console.log("person record added by ajax successfully");
            console.log(data);
            person_id = data.id;
            console.log("returned id:" + data.id + " -> " + person_id);
            //alert("person record added");
            // add this record to the child domain
            var peoplediv = document.getElementById("myUL");
            //console.log("peoplediv:" + JSON.stringify(peoplediv, null, 4));
            var peopleli = peoplediv.getElementsByTagName("li");
            var myhref = "/orders/new/" + person_id;
            var newlihtml = '<li style="display: none;"><a href="' + myhref + '">' + name + '</a></li>';
            var newahtml = '<a href="' + myhref + '">' + name + '</a>';
            console.log("newlihtml: " + newlihtml);
            console.log("newahtml: " + newahtml);
            var eleli = document.createElement("li");
            eleli.innerHTML = newahtml;
            console.log("eleli: " + eleli.innerHTML);
            var elemyUL = document.getElementById("myUL");
            elemyUL.appendChild(eleli); 
            // now to raise the order
            console.log("Now to raise the order - send request");
            console.log("person_id: " + person_id );
            var myurl = "orders/new/" + person_id;
            //window.location.href = myurl;
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add person record");
        }
    });

    return;
}