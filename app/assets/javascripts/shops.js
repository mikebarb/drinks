// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
/* global $*/

//$(document).ready( function () {
//  selectStatus();
//});

App.updateorder = App.cable.subscriptions.create("DestroyorderChannel", {  
  received: function(data) {
    console.log("destroyorders.js - entered ws received function");
    console.dir(data);
    var eleTableBody =  document.getElementById("orders");
    console.dir(eleTableBody);
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        var order_id = data.message;
        console.log("order_id: " + order_id);
        //check if this record is already present 
        // This will be the case for the sender.
        var eleOrderTableRow = document.getElementById(order_id);
        console.dir(eleOrderTableRow);
        if(eleOrderTableRow) {
            //is present so can update state (or anything else).
            //alert("This order entry is present - now update on screen");
            // drop through to remainer of the function.            
        }else{
            // entry must be in the table - update only
            // thus if we get to here, there is an error.
            //alert("Error - this order entry is not present on this page!");
            return;
        }
        // Simply delete this table row
        console.dir(eleOrderTableRow);
        eleOrderTableRow.parentNode.removeChild(eleOrderTableRow);
    }
    return;
  }
});


App.updateorder = App.cable.subscriptions.create("UpdateorderChannel", {  
  received: function(data) {
    console.log("updateorders.js - entered ws received function");
    console.dir(data);
    var eleTableBody =  document.getElementById("orders");
    console.dir(eleTableBody);
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        var order_id = data.message[0];
        console.log("order_id: " + order_id);
        //check if this record is already present 
        // This will be the case for the sender.
        var eleOrderTableRow = document.getElementById(order_id);
        console.dir(eleOrderTableRow);
        if(eleOrderTableRow) {
            //is present so can update state (or anything else).
            //alert("This order entry is present - now update on screen");
            // drop through to remainer of the function.            
        }else{
            // entry must be in the table - update only
            // thus if we get to here, there is an error.
            alert("Error - this order entry is not present on this page!");
            return;
        }      
        var eletds = eleOrderTableRow.getElementsByTagName("td");
        var updatedFields = data.message[1];
        Object.keys(updatedFields).forEach(function(key) {
            console.log("updatedField: " + key +  ": " +updatedFields[key]);
            if ( key == "status") {eletds[4].innerHTML = updatedFields["status"];}
            if ( key == "person_id") {eletds[1].innerHTML = data.message[2];}
            if ( key == "drink_id") {eletds[2].innerHTML = data.message[3];}
            if ( key == "day") {eletds[8].innerHTML = updatedFields["day"];}
            if ( key == "quantity") {eletds[3].innerHTML = updatedFields["quantity"];}
        });
        selectStatus();  
    }
    return;
  }
});

App.neworder = App.cable.subscriptions.create("NeworderChannel", {  
  received: function(data) {
    console.log("neworders.js - entered ws received function");
    console.dir(data);
    var eleTableBody =  document.getElementById("orders");
    console.dir(eleTableBody);
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        var order_id = data.message[0].id;
        //console.log("order_id: " + order_id);
        //check if this record is already present 
        // This will be the case for the sender.
        var eleOrderTableRow = document.getElementById(order_id);
        //console.dir(eleOrderTableRow);
        if(eleOrderTableRow) {
            //already there, do nothing.
            //alert("This order entry is already present!!!");
            return;
        }else{
            //alert("This order entry is not present");
        }      
        var person_name = data.message[1];
        //var person_id = data.message[0].person_id;
        var drink_name = data.message[2];
        //var drink_id = data.message[0].drink_id;
        var created_at = data.message[0].created_at;
        var status = data.message[0].status;
        var day = data.message[0].day;
        var quantity = data.message[0].quantity;

        var hf = "";    //HtmlFragment - short name
        hf = hf + "<td>" + order_id + "</td>";
        hf = hf + "<td>" + person_name + "</td>";
        hf = hf + "<td>" + drink_name + "</td>";
        hf = hf + "<td>" + quantity + "</td>";
        hf = hf + "<td>" + status + "</td>";
        hf = hf + '<td id="' + order_id + '_new" onclick="orderUpdate(this);">To new</td>';
        hf = hf + '<td id="' + order_id + '_ready" onclick="orderUpdate(this);">To ready</td>';
        hf = hf + '<td id="' + order_id + '_done" onclick="orderUpdate(this);">To done</td>';
        hf = hf + "<td>" + day + "</td>";
        hf = hf + "<td>" + created_at + "</td>";
        hf = hf + '<td><a href="/orders/' + order_id + '/edit">Edit</a></td>';
        hf = hf + '<td onclick="destroyOrder(this);">Destroy</td>';

        //console.log("hf: " + hf);
        var eletr = document.createElement("tr");
        eletr.setAttribute("id", order_id );
        eletr.innerHTML = hf;
        //console.dir(eletr);
        eleTableBody.appendChild(eletr);
        selectStatus();  
    }
    return;
  }
});

// this function displays the orders based on the checkbox selections.
function selectStatus(){
    var thisStatus;
    var i = 0; 
    var statusCheckString = "";
    //var statusList = el.parentElement.getElementsByTagName("input");
    var statusList =  document.getElementById("statusSelect").getElementsByTagName("input");
    for(i = 0; i < statusList.length; i++){
        if (statusList[i].checked){
            statusCheckString = statusCheckString + " " +  statusList[i].id;
        }
    }
    var eleTableBody =  document.getElementById("orders");
    var trList = eleTableBody.getElementsByTagName("tr");
    for (i = 0; i < trList.length; i++) {
        //console.log("selectStatus: " + trList[i].childNodes[9].innerHTML);
        //console.dir(trList[i].children[4].innerHTML);
        thisStatus = trList[i].children[4].innerHTML;
        if (statusCheckString.indexOf(thisStatus) > -1) {
            trList[i].style.display = "";
        } else {
            trList[i].style.display = "none";
        }      
    }
}

function orderUpdate(el){
    $(el).css('background-color', '#359');
    //console.log("orderUpdate called." + el.id);
    // this updates the status
    var thisElId = el.id;   // hold this element - number _ new status.
    var order_id = el.parentElement.id;
    //console.log("orderUpdate - order_id: " + order_id);
    var newStatus = thisElId.replace(order_id + "_", "");  //what I want to update the status to.
    //console.log("orderUpdate - newStatus: " + newStatus);

    $.ajax({
        type: 'PUT',
        url: "/orders/" + order_id,
        data: {
                order: {
                            status: newStatus,
                        },
                id: order_id,
                },
        dataType: 'json',
        success: function(){
            //console.log("orders ajax update done");
            $(el).css('background-color', '#ffffff');
            el.parentElement.children[4].innerHTML = newStatus;
            selectStatus();   
        },
        error: function(){
            //console.log("orders ajax update failed");
            alert("Faild to update quantity");
            $(el).css('background-color', '#000');
        }
    });
}

function destroyOrder(el){
    console.log ("destroyOrder called.");
    var eleTr = el.parentElement;
    console.dir(eleTr);
    // Now use ajax to destroy this order
    var myorder_id = eleTr.id;
    //console.log("myorder_id: " + myorder_id);
    $.ajax({
        type: 'DELETE',
        url: "/orders/" + myorder_id,
        dataType: 'json',
        success: function(){
            console.log("ajax destroy successfull: " + myorder_id);
            var eleTrParent = eleTr.parentElement; 
            if (eleTrParent) {eleTrParent.removeChild(eleTr);}
        },
        error: function(){
            console.log("orders ajax deletion failed" + myorder_id);
            alert("failed to delete order record - myorder_id");
        }
    });  
}

function counterSubmitOrder() {
    console.log("counterSubmitOrder: called");
    var eleMyPersonId = document.getElementById("myPersonId");
    var eleMyDrinkId = document.getElementById("myDrinkId");
    var person_id = eleMyPersonId.innerHTML;
    var drink_id = eleMyDrinkId.innerHTML;
    console.log('counterSubmitOrder - myPersonId:' + person_id + " myDrinkId: " + drink_id );
    // Now create a order record in the database using ajax
    $.ajax({
        type: 'POST',
        url: "/orders/submit",
        data: {
            order: {
                person_id: person_id,
                drink_id: drink_id
            }
        },
        dataType: 'json',
        success: function(data){
            console.log("order record added by ajax successfully");
            console.log(data);
            eleMyPersonId.innerHTML = "";
            eleMyDrinkId.innerHTML = "";
            document.getElementById("myPersonName").innerHTML = "";
            document.getElementById("myDrinkName").innerHTML = "";
            submitOrderCheck();
            document.getElementById("personInput").value = "";
            document.getElementById("drinkInput").value = "";
            counterFilterPeople();
            counterDrinks();
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add order record");
        }
    });

    return;
}


function submitOrderCheck(){
    console.log("submitOrderCheck: called");
    var pid = document.getElementById("myPersonId").innerHTML;
    console.log("pid: " + pid);
    if (document.getElementById("myPersonId").innerHTML > 0) {
        console.log("submitOrderCheck: person succeeded " + document.getElementById("myPersonId").innerHTML);
        if (document.getElementById("myDrinkId").innerHTML > 0) {
            console.log("submitOrderCheck: drink succeeded " + document.getElementById("myDrinkId").innerHTML);
            document.getElementById("submitOrder").style.display = "";            
            console.log("submitOrderCheck: return true ");
            return true;
        }
    }
    document.getElementById("submitOrder").style.display = "none";            
    console.log("submitOrderCheck: return false ");
    return false;
}

function counterFilterPeople() {
    var personinput, filter, ul, li, a, i, showAdd;
    var available = 0;
    personinput = document.getElementById("personInput");
    filter = personinput.value.toUpperCase();
    ul = document.getElementById("myPeopleUL");
    showAdd = document.getElementById("showAdd");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        //a = li[i].getElementsByTagName("a")[0];
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
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

function counterAddPerson() {
    var person_id;
    var name = document.getElementById("personInput").value;
    console.log('addPerson:' + name );
    // Now create a person record in the database using ajax
    $.ajax({
        type: 'POST',
        url: "/people",
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
            //<li id="30" onclick="counterSelectPerson(this);" style="display: none;">tim x</li>
            var eleli = document.createElement("li");
            eleli.setAttribute("id", person_id );
            eleli.setAttribute("onclick", "counterSelectPerson(this)" );
            eleli.innerHTML = name;
            document.getElementById("myPeopleUL").appendChild(eleli);
            document.getElementById("myPersonName").innerHTML = "Name: " + data.name;
            document.getElementById("myPersonId").innerHTML = data.id;
            submitOrderCheck();
            counterFilterPeople();
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add person record");
        }
    });

    return;
}

// This function filters the selectable drinks
// Also displays the "add name" button if nothing shows from filter.
// This then allows another function to add this name to the people database.
function counterDrinks() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("drinkInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myDrinksUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        //a = li[i].getElementsByTagName("a")[0];
        a = li[i];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// This function is called when the drink is selected
// It displays the name of the drink selected and 
// populates the form field with the drink_id 
function counterSelectDrink(el){
    var name, id;
    name = el.innerHTML;
    id = el.id;
    console.log('counterAddDrink:' + name + " id: " + id);
    document.getElementById("myDrinkName").innerHTML = "Drink: " + name;
    document.getElementById("myDrinkId").innerHTML = id;
    submitOrderCheck();
    //<input type="text" name="order[drink_id]" id="order_drink_id">
    //elDrinkIdInput =  document.getElementById("order_drink_id");
    //elDrinkIdInput.value = id;
}

// This function is called when the person is selected
// It displays the name of the person selected and 
// populates the form field with the person_id 
function counterSelectPerson(el){
    var name, id;
    name = el.innerHTML;
    id = el.id;
    console.log('counterSelectPerson:' + name + " id: " + id);
    document.getElementById("myPersonName").innerHTML = "Name: " + name; 
    document.getElementById("myPersonId").innerHTML = id;
    // Now update the filter field to make it this person
    // That shortens the list to see the drinks list
    // User can expand again if need be - reenter filter.
    document.getElementById("personInput").value = name;
    counterFilterPeople();
    submitOrderCheck();
}
