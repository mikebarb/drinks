// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
/* global $*/

// This function filters the selectable drinks
// Also displays the "add name" button if nothing shows from filter.
// This then allows another function to add this name to the people database.
function myFunctionDrinks() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
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
function addDrink(el){
    var name, id, elDrinkName, elDrinkIdInput;
    name = el.innerHTML;
    id = el.id;
    console.log('addDrink:' + name + " id: " + id);
    elDrinkName = document.getElementById("myDrinkName");
    elDrinkName.innerHTML = "Drink: " + name; 
    
    //<input type="text" name="order[drink_id]" id="order_drink_id">
    elDrinkIdInput =  document.getElementById("order_drink_id");
    elDrinkIdInput.value = id;
}
