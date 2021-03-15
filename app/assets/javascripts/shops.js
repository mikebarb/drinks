// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
/* global $*/
/* global cloudprint */

//$(document).ready( function () {
//  selectStatus();
//});

var timerReference;

//document.onload = function() {
$(document).on('turbolinks:load', function(){
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

  var thisDrinkArea = document.getElementById("drinkarea");
  if(thisDrinkArea){
    thisDrinkArea.addEventListener("click", actionDrinkButton);
  }
  
  var eleDrinkInput = document.getElementById("otherInput");
  if(eleDrinkInput){
    eleDrinkInput.addEventListener("keyup", actionInput);
    eleDrinkInput.addEventListener("blur", actionInput);
  }
  
  var eleBrewsterSummary = document.getElementById("sumorders");
  if(eleBrewsterSummary){
    countDrinks();
  }
  
  var scrollObj = document.getElementById("scrollText");
  if(scrollObj){
    scrollInit();
  }
    
  var scrollMeObj = document.getElementById("scrollme");
  if(scrollMeObj){
    console.log("scrollMe - call");
    scrollMe();
  }
    
});

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
        countDrinks();
    }

    eleTableBody =  document.getElementById("orderstable");
    //console.dir(eleTableBody);
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        order_id = data.message;
        console.log("order_id: " + order_id);
        //check if this record is already present 
        // This will be the case for the sender.
        eleOrderTableRow = document.getElementById('t' + order_id);
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
        //var eletds = eleOrderTableRow.getElementsByTagName("td");
        var updatedFields = data.message[1];
        Object.keys(updatedFields).forEach(function(key) {
            console.log("updatedField: " + key +  ": " +updatedFields[key]);
            if ( key == "status") {
                console.log("about to update status");
                console.log("got status elements");
                if(eleOrderTableRow.classList.contains("new")) {
                    eleOrderTableRow.classList.remove("new");
                } else if (eleOrderTableRow.classList.contains("ready")) {
                    eleOrderTableRow.classList.remove("ready");
                } else if (eleOrderTableRow.classList.contains("done")) {
                    eleOrderTableRow.classList.remove("done");
                }
                
                eleOrderTableRow.classList.add(updatedFields["status"]);
            }
            if ( key == "person_id") {eleOrderTableRow.getElementsByClassName("ml-2")[0].innerHTML = data.message[2];}
            if ( key == "drink")     {eleOrderTableRow.getElementsByClassName("ml-2")[1].innerHTML = updatedFields[key];}
            //if ( key == "day") {eletds[8].innerHTML = updatedFields["day"];}
            //if ( key == "quantity") {eletds[3].innerHTML = updatedFields["quantity"];}
        });
        selectStatus();
        setScrollText();
        countDrinks();
    }

    // This section will generate a equivalent table versions of the above
    eleTableBody =  document.getElementById("orderstable");
    console.dir(eleTableBody);
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        order_id = data.message[0];
        console.log("order_id: " + order_id);
        //check if this record is already present 
        // This will be the case for the sender.
        eleOrderTableRow = document.getElementById('t' + order_id);
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
        updatedFields = data.message[1];
        Object.keys(updatedFields).forEach(function(key) {
            console.log("updatedField: " + key +  ": " +updatedFields[key]);
            if ( key == "status") {
                eletds[5].innerText = updatedFields["status"];
                // class status is now on the 'tr' tag
                var classList = eleOrderTableRow.classList;
                while (classList.length > 0) {
                  classList.remove(classList.item(0));
                }
                eleOrderTableRow.classList.add("counterstatus" + updatedFields["status"]);
                // Need to hide table rows based on the checkboxes (hidden) i.e. statuses
                var showme = false;
                if(document.getElementById("new") &&
                   updatedFields["status"] == "new"){
                     showme = true;
                }
                if(document.getElementById("ready") &&
                   updatedFields["status"] == "ready"){
                     showme = true;
                }
                if(document.getElementById("done") &&
                   updatedFields["status"] == "done"){
                     showme = true;
                }
                if(showme == false){
                    eleOrderTableRow.classList.add("hideme");
                }
            }
            if ( key == "person_id") {eletds[1].innerHTML = data.message[2];}
            if ( key == "drink") {eletds[2].innerHTML = updatedFields[key];}
            if ( key == "day") {eletds[8].innerHTML = updatedFields[key];}
            if ( key == "quantity") {eletds[3].innerHTML = updatedFields["quantity"];}
        });
        selectStatusTable();
        setScrollText();
    }
    return;
  }
});

// Web Socket receives a new message - new person generated.
App.newperson = App.cable.subscriptions.create("NewpersonChannel", {  
  received: function(data) {
    console.log("newperson.js - entered ws received function");
    var person_id = data.message[0]['id'];
    var name =  data.message[0]['name'];
    var elePeople = document.getElementById("myPeopleUL");
    if(elePeople){
        // Add the person to the list display
        var eleli = document.createElement("li");
        eleli.setAttribute("id", person_id );
        eleli.setAttribute("onclick", "counterSelectPerson(this)" );
        eleli.innerHTML = name;
        // Get all the people in the list (all the <li>)
        var elePersons = elePeople.getElementsByTagName("li");
        if(elePersons){
          for (var i = 0; i < elePersons.length; i++) {     // step thu enteries
            var elePerson = elePersons[i];
            if(name.toLowerCase() < elePerson.innerText.toLowerCase()){
                elePeople.insertBefore(eleli, elePerson);  // goes before
                break;                                     // job done
            }
            if(i == elePersons.length - 1){     // at end and not inserted
              elePeople.appendChild(eleli);     // append
              break;            // job done - array is now longer so get out
            }
          }
        }else{                                              // no list yet
          elePeople.appendChild(eleli);                     // so just append
        }
        submitOrderCheck();
        counterFilterPeople();
    }
  }
});

// Web Socket receives a new message - new order generated.
App.neworder = App.cable.subscriptions.create("NeworderChannel", {
  received: function(data) {
    var order_id = data.message[0].id;
    var person_id = data.message[0].person_id;
    var person_name = data.message[1];
    var drink_name = data.message[2];
    var status = data.message[0].status;
    var quantity = data.message[0].quantity;
    var day = data.message[0].day;
    var created = data.message[0].created_at;

    // need to update last drink for this person in the browser
    if(document.getElementById("myPeopleUL")){
        document.getElementById(person_id).setAttribute("lastdrink", drink_name);
    }

    // Now update the brewster page list of orders
    var eleTableBody =  document.getElementById("orders");
    if (eleTableBody) {
        // this element is defined
        //alert("element with id=orders exists on this page");
        //check if this record is already present 
        // This will be the case for the sender.
        var eleOrderTableRow = document.getElementById(order_id);
        if(eleOrderTableRow) {
            //already there, do nothing.
            //alert("This order entry is already present!!!");
            return;
        }else{
            //alert("This order entry is not present");
        }      
        var eleOrders =  document.getElementById("orders");
        if(eleOrders){
            var elea = document.createElement("div");
            elea.classList.add("list-item");
            elea.classList.add("new");
            elea.id = order_id;
            eleOrders.appendChild(elea);
            
            var eleb = document.createElement("div");
            eleb.classList.add("list-item-content");
            //eleb.classList.add("new");
            elea.appendChild(eleb);
            
            var elec1 = document.createElement("span");
            elec1.style = "display: none";
            elec1.innerText = order_id;
            eleb.appendChild(elec1);
            
            var elec2 = document.createElement("div");
            elec2.classList.add("w-20");
            var elec2d1 = document.createElement("i");
            elec2d1.classList.add("fas");
            elec2d1.classList.add("fa-hiking");
            elec2.appendChild(elec2d1);
            var elec2d2 = document.createElement("span");
            elec2d2.classList.add("ml-2");
            //elec2d2.classList.add("counterstatus" + status);
            elec2d2.innerText = person_name;
            elec2.appendChild(elec2d2);
            eleb.appendChild(elec2);
            
            var elec3 = document.createElement("div");
            elec3.classList.add("w-20");
            var elec3d1 = document.createElement("i");
            elec3d1.classList.add("fas");
            elec3d1.classList.add("fa-coffee");
            elec3.appendChild(elec3d1);
            var elec3d2 = document.createElement("span");
            elec3d2.classList.add("ml-2");
            //elec3d2.classList.add("counterstatus" + status);
            elec3d2.innerText = drink_name;
            elec3.appendChild(elec3d2);
            eleb.appendChild(elec3);
            
            var elec4 = document.createElement("span");
            elec4.style = "display: none";
            elec4.innerText = quantity;
            eleb.appendChild(elec4);
            
            //var elec5 = document.createElement("span");
            //elec5.classList.add("counterstatus" + status);
            //elec5.innerText = status;
            //eleb.appendChild(elec5);

            var elec6 = document.createElement("div");
            elec6.classList.add("ml-auto");
            elec6.classList.add("selection-container");
            eleb.appendChild(elec6);

            // new button
            var elec6d1 = document.createElement("div");
            elec6d1.id = order_id + "_new";
            elec6d1.classList.add("new-radio-button");
            elec6d1.classList.add("counterbuttonnew");
            elec6d1.onclick = function(){orderUpdate(this);};
            elec6.appendChild(elec6d1);
            var elec6d1e1 = document.createElement("i");
            elec6d1e1.classList.add("fas");
            elec6d1e1.classList.add("fa-surprise");
            elec6d1.appendChild(elec6d1e1);
            var elec6d1e2 = document.createElement("span");
            //elec6d1e2.id = order_id + '_new';
            //elec6d1e2.classList.add("counterbutton" + status);
            //elec6d1e2.onclick = function(){orderUpdate(this);};
            elec6d1e2.innerText = "New";
            elec6d1.appendChild(elec6d1e2);

            // ready button
            var elec6d2 = document.createElement("div");
            elec6d2.id = order_id + "_ready";
            elec6d2.classList.add("ready-radio-button");
            elec6d2.classList.add("counter-button-ready");
            elec6d2.onclick = function(){orderUpdate(this);};
            var elec6d2e1 = document.createElement("i");
            elec6d2e1.classList.add("fas");
            elec6d2e1.classList.add("fa-stopwatch");
            elec6d2.appendChild(elec6d2e1);
            var elec6d2e2 = document.createElement("span");
            //elec6d2e2.id = order_id + '_ready';
            //elec6d2e2.classList.add("counterbutton" + status);
            //elec6d2e2.onclick = function(){orderUpdate(this);};
            elec6d2e2.innerText = "Ready";
            elec6d2.appendChild(elec6d2e2);
            elec6.appendChild(elec6d2);

            // done button
            var elec6d3 = document.createElement("div");
            elec6d3.id = order_id + "_done";
            elec6d3.classList.add("done-radio-button");
            elec6d3.classList.add("counterbuttondone");
            elec6d3.onclick = function(){orderUpdate(this);};
            var elec6d3e1 = document.createElement("i");
            elec6d3e1.classList.add("fas");
            elec6d3e1.classList.add("fa-check");
            elec6d3.appendChild(elec6d3e1);
            var elec6d3e2 = document.createElement("span");
            //elec6d3e2.id = order_id + '_done';
            //elec6d3e2.classList.add("counterbutton" + status);
            //elec6d3e2.onclick = function(){orderUpdate(this);};
            elec6d3e2.innerText = "Done";
            elec6d3.appendChild(elec6d3e2);
            elec6.appendChild(elec6d3);
        }
    }

    // Now update the orders table list of orders
    eleOrders =  document.getElementById("orderstable");
    if(eleOrders){
        // The all orders web page
        if(document.getElementById("allorders")){
            var hfao = "";
            hfao = hfao + "<td>" + order_id + "</td>";
            hfao = hfao + "<td>" + person_name + "</td>";
            hfao = hfao + "<td>" + drink_name + "</td>";
            hfao = hfao + "<td>" + quantity + "</td>";
            hfao = hfao + "<td>" + status + "</td>";
            
            hfao = hfao + '<td id="t' + order_id + '_new" onclick="orderUpdate(this);">To new</td>';
            hfao = hfao + '<td id="t' + order_id + '_ready" onclick="orderUpdate(this);">To ready</td>';
            hfao = hfao + '<td id="t' + order_id + '_done" onclick="orderUpdate(this);">To done</td>';
            hfao = hfao + "<td>" + day + "</td>";
            hfao = hfao + "<td>" + created + "</td>";
            hfao = hfao + "<td><a href=\"/orders/" + order_id + "/edit\">Edit</a></td>";
            hfao = hfao + "<td onclick=\"destroyOrder(this);\">Destroy</td>";

            //console.log("hfao: " + hfao);
            var eletr = eleOrders.insertRow(0);
            eletr.setAttribute("id", 't' + order_id );
            eletr.innerHTML = hfao;
        }else{
            // the ready or check page - on the image background
            var className = "class='counterstatus" + status + "'";
            var hf = "";    //HtmlFragment - short name
            hf = hf + "<td>" + "<i class=\"new-icon fas fa-minus\" aria-hidden=\"true\"></i>" + 
                               "<i class=\"ready-icon fas fa-check\" aria-hidden=\"true\">" +
                               "</i>" + "</td>";
            hf = hf + "<td style=display:none>" + order_id + "</td>";
            hf = hf + "<td>" + "<i class=\"fas fa-hiking mr-2 hideme\" aria-hidden=\"true\"></i>" + person_name + "</td>";
            var pageCheck = document.getElementById("pageCheck");
            // only display drink on the check page, not the ready page.
            if (pageCheck){
                hf = hf + "<td>";
            }else{
                hf = hf + "<td style=display:none>";
            }
            hf = hf + "<i class=\"fas fa-coffee mr-2 hideme\" aria-hidden=\"true\"></i>(" + drink_name + ")</td>";
            hf = hf + "<td style=display:none>" + quantity + "</td>";
            hf = hf + "<td style=display:none>" + status + "</td>";
            //hf = hf + '<td id="t' + order_id + '_new" onclick="orderUpdate(this);">New</td>';
            //hf = hf + '<td id="t' + order_id + '_ready" onclick="orderUpdate(this);">Ready</td>';
            //hf = hf + '<td id="t' + order_id + '_done" onclick="orderUpdate(this);">Done</td>';

            console.log("hf: " + hf);
            eletr = document.createElement("tr");
            eletr.setAttribute("id", 't' + order_id );
            eletr.className = "counterstatus" + status;
            //eletr.style.display = "block";
            eletr.innerHTML = hf;
            eleOrders.appendChild(eletr);
        }
    }
    selectStatus();
    selectStatusTable();
    countDrinks();
    
    console.log("About to process printlabel - first check if on correct page");
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

function selectStatusBoth(){
    selectStatus();
    selectStatusTable();
}

// this function displays the orders based on the checkbox selections.
// this one is for the id=orders display area
function selectStatus(){
    console.log("enter selectStatus");
    var i = 0; 
    var statusCheckString = "";
    if(document.getElementById("statusSelect") == null){
        return;
    }
    var statusList =  document.getElementById("statusSelect").getElementsByTagName("input");
    for(i = 0; i < statusList.length; i++){
        if (statusList[i].checked){
            statusCheckString = statusCheckString + " " +  statusList[i].id;
        }
    }
    console.log("statusCheckString:" + statusCheckString);
    var eleTableBody =  document.getElementById("orders");
    if(eleTableBody){
        var trList = eleTableBody.getElementsByClassName("list-item");
        for(i = 0; i < trList.length; i++) {
            var showme = false;
            if(statusCheckString.indexOf("new") > -1){
                if (trList[i].classList.contains("new")){
                    showme = true;
                }
            }
            if(statusCheckString.indexOf("ready") > -1){
                if (trList[i].classList.contains("ready")){
                    showme = true;
                }
            }
            if(statusCheckString.indexOf("done") > -1){
                if (trList[i].classList.contains("done")){
                    showme = true;
                }
            }
            if (showme) {
                trList[i].style.display = "";
            } else {
                trList[i].style.display = "none";
            }
        }
    }
    console.log("exit selectStatus");
}

// this function displays the orders based on the checkbox selections.
// this one is for the id=orderstable display area
function selectStatusTable(){
    console.log("enter selectStatusTable");
    //var thisStatus;
    var eleListItemStatus;
    var i = 0; 
    var statusCheckString = "";
    //var statusList = el.parentElement.getElementsByTagName("input");
    if(document.getElementById("statusSelect") == null){
        return;
    }
    var statusList =  document.getElementById("statusSelect").getElementsByTagName("input");
    for(i = 0; i < statusList.length; i++){
        if (statusList[i].checked){
            statusCheckString = statusCheckString + " " +  statusList[i].id;
        }
    }
    var eleTableBody =  document.getElementById("orderstable");
    if(eleTableBody){
        var trList = eleTableBody.getElementsByTagName("tr");
        //var eleTableBody =  document.getElementById("orderstable");
        //var trList = eleTableBody.getElementsByClassName("list-item");
        for(i = 0; i < trList.length; i++) {
            var showme = false;
            //var eleListItemStatus1 = trList[i].getElementsByClassName("w-20")[0];
            var tdList = trList[i].getElementsByTagName("td");
            
            //eleListItemStatus = eleListItemStatus1.getElementsByTagName("span")[0];
            eleListItemStatus = tdList[5].innerText;
                    
            if(statusCheckString.indexOf("new") > -1){
                if (eleListItemStatus == 'new'){
                    showme = true;
                }
            }
            
            if(statusCheckString.indexOf("ready") > -1){
                if (eleListItemStatus == 'ready'){
                    showme = true;
                }
            }
            if(statusCheckString.indexOf("done") > -1){
                if (eleListItemStatus == 'done'){
                    showme = true;
                }
            }
            //console.log("selectStatus: " + trList[i].childNodes[4].innerHTML);
            //console.dir(trList[i].children[4].innerHTML);
            //thisStatus = trList[i].children[4].innerHTML;
            //if (statusCheckString.indexOf(thisStatus) > -1) {
            if (showme) {
                trList[i].style.display = "";
            } else {
                trList[i].style.display = "none";
            }
        }
    }
    console.log("exit selectStatusTable");
}

// This function is called when a status update is requested.
function orderUpdate(el){
    //$(el).css('background-color', '#359');
    //console.log("orderUpdate called." + el.id);
    // this updates the status
    var thisElId = el.id;   // hold this element - number _ new status.
    //var order_id = el.parentElement.id;
    var order_id = thisElId.split("_", 1)[0];
    var newStatus = thisElId.replace(order_id + "_", "");  //what I want to update the status to.
    // in tables, the element id has a t prefix to the orderId!
    if(order_id.substring(0,1) == 't'){
        order_id = order_id.substring(1);
    }
    //console.log("orderUpdate - order_id: " + order_id);
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
            console.log($(el))
            //$(".selected-button").removeClass("selected-button");
            //$(el).addClass("selected-button");
            $(".selected-button").removeClass("new");
            $(".selected-button").removeClass("ready");
            $(".selected-button").removeClass("done");
            $(el).addClass(newStatus);
            console.log(newStatus);
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
    // in tables, the element id has a t prefix to the orderId!
    if(myorder_id.substring(0,1) == 't'){
        myorder_id = myorder_id.substring(1);
    }
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
    //var eleMyDrinkId = document.getElementById("myDrinkId");
    var eleMyDrink = document.getElementById("myDrinkName");
    var person_id = eleMyPersonId.innerHTML;
    //var drink_id = eleMyDrinkId.innerHTML;
    var drink = eleMyDrink.innerHTML.replace("", "").trim();
    console.log("drink:" + drink);
    console.log('counterSubmitOrder - myPersonId:' + person_id + " myDrink: " + drink );
    // Now create a order record in the database using ajax
    $.ajax({
        type: 'POST',
        url: "/orders/submit",
        data: {
            order: {
                person_id: person_id,
                drink: drink
            }
        },
        dataType: 'json',
        success: function(data){
            console.log("order record added by ajax successfully");
            console.log(data);
            // clear the fields for people with their drinks            
            eleMyPersonId.innerHTML = "";
            eleMyDrink.innerHTML = "";
            document.getElementById("myPersonName").innerHTML = "";
            document.getElementById("myDrinkName").innerHTML = "";
            submitOrderCheck();
            // put up some feedback to the user that the order is submitted.
            document.getElementById('submitConfirm').style.display = ""; 
            setTimeout(function() {document.getElementById('submitConfirm').style.display = "none"},1000);
            // Bill wants a family to quickly submit their orders.
            // Key in family name, and continue to select from filtered list.
            //document.getElementById("personInput").value = "";
            //counterFilterPeople();
            // Want to show the clearFilter button if text in the search field
            if(document.getElementById("personInput").value.length != 0){
              document.getElementById("buttonClearFilter").classList.remove("hideme");
            }
            //counterDrinks();
            // need to update last drink id for this person in the browser
            document.getElementById(person_id).setAttribute("lastdrink", drink);
            document.getElementById("myDrinkName").removeAttribute("class", "colourgrey");
            initialiseDrinkButton();
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add order record");
        }
    });

    return;
}

// This function clears the text field controlling the filtering of persons
function clearFilter(){
            document.getElementById("personInput").value = "";
            counterFilterPeople();
            // Want to hide the clearFilter button again
            document.getElementById("buttonClearFilter").classList.add("hideme");
}

// This function checks the name and drinks field to see if they are populatated.
// If so, then displays the submit order button
// If not, then the button is hidden.
function submitOrderCheck(){
    console.log("submitOrderCheck: called");
    var pid = document.getElementById("myPersonId").innerHTML;
    console.log("pid: " + pid);
    if (document.getElementById("myPersonId").innerHTML.length > 0) {
        console.log("submitOrderCheck: person succeeded " + document.getElementById("myPersonId").innerHTML);
        if (document.getElementById("myDrinkName").innerHTML.length > 0) {
            console.log("submitOrderCheck: drink succeeded " + document.getElementById("myDrinkName").innerHTML);
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
    // Want to hide the clearFilter button
    document.getElementById("buttonClearFilter").classList.add("hideme");
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
            /*
            // Add the person to the list display
            var eleli = document.createElement("li");
            eleli.setAttribute("id", person_id );
            eleli.setAttribute("onclick", "counterSelectPerson(this)" );
            eleli.innerHTML = name;
            document.getElementById("myPeopleUL").appendChild(eleli);
            document.getElementById("myPersonName").innerHTML = "" + data.name;
            document.getElementById("myPersonId").innerHTML = data.id;
            submitOrderCheck();
            counterFilterPeople();
            */
        },
        error: function(){
            console.log("orders ajax update failed");
            alert("failed to add person record");
        }
    });

    return;
}
/*
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
*/
// This function is called when the drink is selected
// It displays the name of the drink selected and 
// populates the form field with the drink_id 
function counterSelectDrink(el){
    var name, id;
    name = el.innerHTML;
    id = el.id.substring(1);  // remove the d prefix
    console.log('counterAddDrink:' + name + " id: " + id);
    document.getElementById("myDrinkName").innerHTML = "" + name;
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
    var name, id, lastdrink;
    initialiseDrinkButton();
    name = el.innerHTML;
    id = el.id;
    console.dir(el);
    console.log('counterSelectPerson:' + name + " id: " + id);
    lastdrink = el.getAttribute("lastdrink");
    console.log('counterSelectPerson:' + name + " lastdrink: " + lastdrink);
    if(lastdrink){
        document.getElementById("myDrinkName").innerText = "" + lastdrink;
    }
/*  
    if (lastdrink) {
        //var eldrink = document.getElementById("d" + lastdrinkid);
        //var drinkname = eldrink.innerHTML;
        //var drinkid = eldrink.id;
        console.log ("drink element - drinkname: " + lastdrink);
        //document.getElementById("myDrinkId2").innerText = lastdrink;
        document.getElementById("myDrinkName").innerText = "Drink: " + lastdrink;
        //counterSelectDrink(eldrink);
        //document.getElementById("myDrinkName").setAttribute("class", "colourgrey");
    }else{
        //document.getElementById("myDrinkName").removeAttribute("class", "colourgrey");
    }
*/
    document.getElementById("myPersonName").innerHTML = "" + name; 
    document.getElementById("myPersonId").innerHTML = id;
    // Now update the filter field to make it this person
    // That shortens the list to see the drinks list
    // User can expand again if need be - reenter filter.
    //** enables filter entry ** document.getElementById("personInput").value = name;
    counterFilterPeople();
    highlightPerson(el);
    submitOrderCheck();
}

function highlightPerson(el){
    var personParent = el.parentElement;
    var persons = personParent.children;
    for(var i=0; i< persons.length; i++){
        if (persons[i].classList.contains("personselected")){
            persons[i].classList.remove("personselected");
        }
    }
    el.classList.add("personselected");
}


// This function counts the drinks types in the orders
function countDrinks() {
    console.log("countDrinks called");
    var drinktable = document.getElementById("sumorders");
    if(drinktable){
        var  i, drink_name;
        var counts = {};
        var orderList = document.getElementsByClassName("list-item");
        for (i = 0; i < orderList.length; i++) {
            //if (trList[i].classList.contains("new")){
            if (orderList[i].classList.contains("new")){
                //var orderListItems = orderList[i].getElementsByClassName("fa-coffee");
                //var thisItem = orderListItems[0];
                var thisItem = orderList[i].getElementsByClassName("fa-coffee")[0];
                //var thisEle = thisItem.parentElement.getElementsByTagName("span")[0];
                var drink_name = thisItem.parentElement.getElementsByTagName("span")[0].innerText;
                //if(thisEle.classList.contains("counterstatusnew")){
                    //drink_name = thisEle.innerText;
                    if (counts[drink_name]){
                        counts[drink_name] = counts[drink_name] + 1;
                    }else{
                        counts[drink_name] = 1;
                    }
                //}
            }
        }
        
        // sort array counts by drink name
        var countskeys = Object.keys(counts);
        countskeys.sort();
        var eleTable = document.getElementById("sumorders");
        eleTable.innerHTML = '';
        for (i = 0; i < countskeys.length; i++) {
            var eleTr = document.createElement("tr");
            eleTr.innerHTML = "<td>" + countskeys[i] + "</td>" +
                              "<td>" + counts[countskeys[i]] + "</td>";
            eleTable.appendChild(eleTr);
        }
    }
}

// Called when order is submitted.
// For drink buttons, deselect all drink buttons.
function initialiseDrinkButton(){
    var drinkButtons = document.getElementsByClassName("drinkbutton");
    // deselect all selected drink buttons
    for (var i=0; i<drinkButtons.length; i++){
        if(drinkButtons[i].classList.contains("selected")){
            drinkButtons[i].classList.remove("selected");
        }
    }
    hideAllOptionButtons();
    makeDrinkDescription();
}

// Called with any of the drink or option buttons are pressed.
// For drink buttons, if already selected, then deselect.
// Otherwise select ths button.
function actionDrinkButton(ev){
    console.log(ev);
    var thisEle = ev.target;
    if(thisEle.classList.contains("drinkbutton")){
        //console.log("drink button pressed.");
        ev.preventDefault();
        if(thisEle.classList.contains("selected")){
            thisEle.classList.remove("selected");
            hideAllOptionButtons();
        }else{
            actionRadioButtonEffect(thisEle);
            actionButtonSelection(thisEle);
        }
    }else if(thisEle.classList.contains("optionsbutton")){
        //console.log("options button pressed");
        ev.preventDefault();
        actionRadioButtonEffect(thisEle);
    }
    makeDrinkDescription();
    //console.log("drink selected is: " + drinkDesc);
    //document.getElementById("myDrinkId2").innerText = drinkDesc;
}

function actionRadioButtonEffect(thisEle){
    console.log("actionRadioButtonEffect called");
    // Ignore if this is the Misc group
    if(thisEle.parentElement.firstElementChild.textContent == "Misc"){
        if(thisEle.classList.contains("selected")){
            thisEle.classList.remove("selected");
        }else{
            thisEle.classList.add("selected");
        }
        return;
    }
    // Now do all other groups.
    if(thisEle.id == "otherInput"){
        // do nothing
    }else if(thisEle.classList.contains("selected")){
        thisEle.classList.remove("selected");
    }else{
        var thisParent = thisEle.parentElement;
        var theseChildren = thisParent.children;
        for (var i = 0; i <theseChildren.length; i++){
            if(theseChildren[i].classList.contains("selected")){
                theseChildren[i].classList.remove("selected");
            }
        }
        thisEle.classList.add("selected");
    }
}

function actionButtonSelection(thisEle){
    // hide all the option groups
    var i, iEle;
    var myOptionGroups = document.getElementById("grpoptionsgroups").children;
    for (i = 0; i < myOptionGroups.length; i++){
        myOptionGroups[i].classList.add("hidemegrp");
    }
    // now determine what option buttons need to be enabled
    var enableButtons = thisEle.dataset.enable.split(", ");
    //console.log("enable: " + enableButtons);
    // step through all option buttons enable / disable as specified
    var optionButtons = document.getElementsByClassName("optionsbutton");
    for (i = 0; i < optionButtons.length; i++){
        iEle = optionButtons[i];
        if(iEle.classList.contains("selected")){
            iEle.classList.remove("selected");
        }
        if(enableButtons.includes(iEle.id)){
           // This button is to be enabled
            iEle.classList.remove("hideme");
            if(iEle.parentElement.classList.contains("hidemegrp")){
                iEle.parentElement.classList.remove("hidemegrp");
            }
        }else{
            iEle.classList.add("hideme");
        }
    }
    // clear content of inputDrink field
    document.getElementById("otherInput").value = "";
}

function hideAllOptionButtons(){
    // hide all the option groups
    var i, iEle;
    var myOptionGroups = document.getElementById("grpoptionsgroups").children;
    for (i = 0; i < myOptionGroups.length; i++){
        myOptionGroups[i].classList.add("hidemegrp");
    }
    // step through all option buttons to disable and deselect
    var optionButtons = document.getElementsByClassName("optionsbutton");
    for (i = 0; i < optionButtons.length; i++){
        iEle = optionButtons[i];
        if(iEle.classList.contains("selected")){
            iEle.classList.remove("selected");
            iEle.classList.add("hideme");
        }
    }
    // clear content of inputDrink field
    document.getElementById("otherInput").value = "";
}

function makeDrinkDescription(){
    console.debug("makeDrinkDescription entered");
    var desc = "";
    var i, iEle;
    // If other drink is selected, then just pick up that description.
    iEle = document.getElementById("other");
    if(iEle.classList.contains("selected")){
        desc = document.getElementById("otherInput").value;
        //document.getElementById("myDrinkId2").innerText = desc.trim();
        //document.getElementById("myDrinkName").innerText = desc.trim();
        document.getElementById("myDrinkName").innerText = "" + desc.trim();
        submitOrderCheck();
        return;
    }

    // step through all drink buttons
    var drinkButtons = document.getElementsByClassName("drinkbutton");
    for (i = 0; i < drinkButtons.length; i++){
        iEle = drinkButtons[i];
        if(iEle.classList.contains("selected")){
            desc = desc + iEle.innerText + " ";
        }
    }


    // step through all option buttons
    var optionButtons = document.getElementsByClassName("optionsbutton");
    for (i = 0; i < optionButtons.length; i++){
        iEle = optionButtons[i];
        if(iEle.classList.contains("selected")){
            desc = desc + iEle.innerText + " ";
        }
    }
    //document.getElementById("myDrinkId2").innerText = desc.trim();
    document.getElementById("myDrinkName").innerText = "" + desc.trim();
    submitOrderCheck();
    return;
}

function actionInput(){
    console.log("key up in other done");
    //if(event.keyCode === 13){
    //    console.log("return key pressed.");
    //    makeDrinkDescription();
    //}
    // For the mobile view to be not confusing,
    // just continually update.
    makeDrinkDescription();
}

// scrolling text on ready screen
//var scrollObject = null;
var animate;
function scrollInit(){
    //console.log("entering scrollInit");
    //scrollObj = document.getElementById("scrollText");
    var scrollObj = document.getElementById("scrollText");
    scrollObj.style.position='relative';
    scrollObj.style.left ='0px';
    moveRight(scrollObj);
}

function moveRight(scrollObj) {
    //console.log("entering moveRight");
    scrollObj.style.left = parseInt(scrollObj.style.left) + 10 + 'px';
    animate = setTimeout(moveRight(), 1000);    // call moveRight in 20msec
}

function scrollMe(){
    var eleScrollMe = document.getElementById("scrollme");
    //console.log("scrollMe called");
    if(eleScrollMe){
        if(timerReference == null){
            timerReference = setInterval(scrollMe2, 3000);
        }
    }
}

function stopScrollMe(){
    clearInterval(timerReference);   // stop the timer
    timerReference = null;
}

function scrollMe2(){
    var eleScrollMe = document.getElementById("scrollme");
    //console.log("scrollMe2 called");
    if(eleScrollMe){
        var myText = eleScrollMe.innerHTML.trim();
        var myTextList = eleScrollMe.innerHTML.trim().split(" - ");
        if(myTextList.length > 1){
            var tmpText = myTextList.pop();
            eleScrollMe.innerHTML = tmpText + " - " + myTextList.join(" - "); 
        }
    }
}

function setScrollText(){
    console.log("setScrollText called");
    if(document.getElementById("readyorders")){   // on the ready / pickup page
        var theseOrders = document.getElementById('orderstable').getElementsByTagName('tr');
        //var orderList = [];
        //for(var i=0; i<theseOrders.length; i++){
        //    orderList.push(theseOrders[i].getElementsByTagName('td'));
        //}
        //var orderNames = document.getElementsByClassName("counterStatusReady");
        //var orderList = document.getElementsBytag("orders").children;
        var myText = "";
        for(var i=0; i<theseOrders.length; i++){
            var myName = theseOrders[i].getElementsByTagName('td')[1].innerText;
            var myStatus = theseOrders[i].getElementsByTagName('td')[4].innerText;
            if(myStatus == "ready"){
                if(myText.length > 0){
                    myText = myText + " - ";
                }
                myText = myText + myName;
            }
        }
        var eleScrollme = document.getElementById("scrollme");
        if(eleScrollme){     // if element is present, do the scroll
          eleScrollme.innerText = myText;
          // only show this text if it has content
          if(myText.length > 1){
            if(eleScrollme.classList.contains("hideme")){
                eleScrollme.classList.remove("hideme");
                scrollMe();
            }
          }else{
            eleScrollme.classList.add("hideme");
            stopScrollMe();
          }
        }
    }
}
