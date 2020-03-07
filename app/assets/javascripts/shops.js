// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
/* global $*/
/* global cloudprint */

//$(document).ready( function () {
//  selectStatus();
//});



window.onload = function() {
  console.log("window.onload function called");
  countDrinks();
  var elePrintLabel =  document.getElementById("printlabel");
  console.dir(elePrintLabel);
  if (elePrintLabel) {
    console.log("In window.onload for print screen");
    var gadget = new cloudprint.Gadget();
    console.log("just called cloudprint.Gaget()");
    console.dir(gadget);
    gadget.setPrintButton(
    cloudprint.Gadget.createDefaultPrintButton("print_button_container")); // div id to contain the button
    //gadget.setPrintDocument("[document mimetype]", "[document title]", "[document content]", "[encoding] (optional)");
    gadget.setPrintDocument("url", "Test Page",
    "https://static.googleusercontent.com/media/www.google.com/en//landing/cloudprint/testpage.pdf"
    );
  }
}

// Web Socket receives a new message - existing order is deleted.
App.destroyorder = App.cable.subscriptions.create("DestroyorderChannel", {  
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

// Web Socket receives a new message - existing order updated, generally
// a status change.
App.updateorder = App.cable.subscriptions.create("UpdateorderChannel", {  
  received: function(data) {
    console.log("shops.js - entered ws received function - UpdateOrderChannel");
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
            if ( key == "status") {
                eletds[4].innerHTML = updatedFields["status"];
                eletds[4].className = '';
                eletds[1].className = '';
                eletds[2].className = '';
                eletds[4].className = 'counterstatus' + updatedFields["status"];
                eletds[1].className = 'counterstatus' + updatedFields["status"];
                eletds[2].className = 'counterstatus' + updatedFields["status"];
            }
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

// Web Socket receives a new message - new order generated.
App.neworder = App.cable.subscriptions.create("NeworderChannel", {  
  received: function(data) {
    console.log("neworders.js - entered ws received function");
    console.dir(data);
    var person_name = data.message[1];
    var drink_name = data.message[2];
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
        //var person_name = data.message[1];
        //var person_id = data.message[0].person_id;
        //var drink_name = data.message[2];
        //var drink_id = data.message[0].drink_id;
        var created_at = data.message[0].created_at;
        var status = data.message[0].status;
        var day = data.message[0].day;
        var quantity = data.message[0].quantity;
        var hf = "";    //HtmlFragment - short name
        if(document.getElementById("allorders")){
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
        }
        if(document.getElementById("readyorders")){
        hf = hf + '<td style="display: none;">' + order_id + "</td>";
        hf = hf + "<td>" + person_name + "</td>";
        hf = hf + "<td>" + drink_name + "</td>";
        hf = hf + '<td style="display: none;">' + quantity + "</td>";
        hf = hf + '<td style="display: none;">' + status + "</td>";
        }
        if(document.getElementById("neworders")){
        hf = hf + '<td style="display: none;">' + order_id + "</td>";
        hf = hf + "<td>" + person_name + "</td>";
        hf = hf + "<td>" + drink_name + "</td>";
        hf = hf + '<td style="display: none;">' + quantity + "</td>";
        hf = hf + '<td>' + status + "</td>";
        hf = hf + '<td id="' + order_id + '_new" onclick="orderUpdate(this);">To new</td>';
        hf = hf + '<td id="' + order_id + '_ready" onclick="orderUpdate(this);">To ready</td>';
        hf = hf + '<td id="' + order_id + '_done" onclick="orderUpdate(this);">To done</td>';
        }    
        //console.log("hf: " + hf);
        var eletr = document.createElement("tr");
        eletr.setAttribute("id", order_id );
        eletr.innerHTML = hf;
        //console.dir(eletr);
        eleTableBody.appendChild(eletr);
        selectStatus(); 
        countDrinks();
    }
    console.log("Abount to process printlabel - first check if on correct page");
    var eleDivPrint =  document.getElementById("printlabel");
    console.dir(eleDivPrint);
    if (eleDivPrint) {
        console.log("About to process printing on new record created.");
        var thisContent = person_name + "<br>" + drink_name;
        eleDivPrint.innerHTML = thisContent;
        // do printing here
        //###window.print();
        //###eleDivPrint.innerHTML = thisContent + "<br><b>Print Sent</b>";
    }
    return;
  }
});

// this function displays the orders based on the checkbox selections.
function selectStatus(){
    console.log("enter selectStatus");
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
    for(i = 0; i < trList.length; i++) {
        console.log("selectStatus: " + trList[i].childNodes[9].innerHTML);
        console.dir(trList[i].children[4].innerHTML);
        thisStatus = trList[i].children[4].innerHTML;
        if (statusCheckString.indexOf(thisStatus) > -1) {
            trList[i].style.display = "";
        } else {
            trList[i].style.display = "none";
        }
    }
    console.log("exit selectStatus");
}

// This function is called when a status update is requested.
function orderUpdate(el){
    //$(el).css('background-color', '#359');
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
            console.log("orders ajax update done");
            //$(el).css('background-color', '#ffffff');
            //el.parentElement.children[4].innerHTML = newStatus;
            //selectStatus();
            countDrinks();
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
            countDrinks();
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
            document.getElementById("myPersonName").innerHTML = "Name:";
            document.getElementById("myDrinkName").innerHTML = "Drink:";
            submitOrderCheck();
            document.getElementById("personInput").value = "";
            document.getElementById("drinkInput").value = "";
            counterFilterPeople();
            counterDrinks();
            // need to update last drink id for this person in the browser
            document.getElementById(person_id).setAttribute("lastdrink", drink_id);
            document.getElementById("myDrinkName").removeAttribute("class", "colourgrey");
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add order record");
        }
    });

    return;
}

// This function checks the name and drinks field to see if they are popluatated.
// If so, then displays the submit order button
// If not, then the button is hidden.
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
    var personinput, filter, ul, li, i, showButtonAddPerson;
    var available = 0;
    var fullMatch = 0;
    personinput = document.getElementById("personInput");
    filter = personinput.value.toUpperCase();
    ul = document.getElementById("myPeopleUL");
    showButtonAddPerson = document.getElementById("buttonAddPerson");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        //a = li[i].getElementsByTagName("a")[0];
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            available += 1;
        } else {
            li[i].style.display = "none";
        }
        if(0 == li[i].innerHTML.toUpperCase().localeCompare(filter)){
            fullMatch = 1;
        }
    }
    showButtonAddPerson.className = '';
    if (filter.length > 0 && fullMatch == 0) {
        showButtonAddPerson.classList.add("showme");
    } else {
        showButtonAddPerson.classList.add("hideme");
    }
}

// When the user keys into the filter field a name that is not in the list
// then this person can be added by clicking the "add person" button.
// This function is called to add person to the database.
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
    id = el.id.substring(1);  // remove the d prefix
    console.log('counterAddDrink:' + name + " id: " + id);
    document.getElementById("myDrinkName").innerHTML = "Drink: " + name;
    document.getElementById("myDrinkName").removeAttribute("class", "colourgrey");
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
    var name, id, lastdrinkid;
    name = el.innerHTML;
    id = el.id;
    console.dir(el);
    console.log('counterSelectPerson:' + name + " id: " + id);
    lastdrinkid = el.getAttribute("lastdrink");
    console.log('counterSelectPerson:' + name + " lastdrinkid: " + lastdrinkid);
    if (lastdrinkid) {
        var eldrink = document.getElementById("d" + lastdrinkid);
        var drinkname = eldrink.innerHTML;
        var drinkid = eldrink.id;
        console.log ("drink element - drinkname: " + drinkname + " drinkid: " + drinkid);
        counterSelectDrink(eldrink);
        document.getElementById("myDrinkName").setAttribute("class", "colourgrey");
    }else{
        document.getElementById("myDrinkName").removeAttribute("class", "colourgrey");
    }document.getElementById("myPersonName").innerHTML = "Name: " + name; 
    document.getElementById("myPersonId").innerHTML = id;
    // Now update the filter field to make it this person
    // That shortens the list to see the drinks list
    // User can expand again if need be - reenter filter.
    //** enables filter entry ** document.getElementById("personInput").value = name;
    counterFilterPeople();
    submitOrderCheck();
}

// This function counts the drinks types in the orders
function countDrinks() {
    console.log("countDrinks called");
    var drinktable = document.getElementById("sumorders");
    if(drinktable){
        var  i, row, drink_name, status;
        var counts = {};
        var ordertable = document.getElementById("orders");
        var orderrows = ordertable.getElementsByTagName("tr");
        for (i = 0; i < orderrows.length; i++) {
            row = orderrows[i];
            status = row.children[4].innerHTML;
            if (status == "new") {
                drink_name = row.children[2].innerHTML;
                if (counts[drink_name]){
                    counts[drink_name] = counts[drink_name] + 1;
                }else{
                    counts[drink_name] = 1;
                }
            }
        }
        // Now update drink quantities in drink table
        console.dir(counts);
        var drinkrows = drinktable.getElementsByTagName("tr");
        for (i = 0; i < drinkrows.length; i++) {
            row = drinkrows[i];
            var this_drink_name = row.children[0].innerHTML;
            var this_drink_count = counts[this_drink_name]; 
            if (this_drink_count) {
                console.log("this_drink_name: " + this_drink_name + " : " + this_drink_count);
                row.children[1].innerHTML = this_drink_count;
                row.removeAttribute("class", "hideMe");
            } else {
                row.children[1].innerHTML = "";
                row.setAttribute("class", "hideMe");
            }
          
        }
    }
}
