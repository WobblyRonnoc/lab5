/*
AJAX REQUEST [A]
on page ready: make Ajax request to the server
to get the names of the restaurants in [restaurant_review.xml]
.*/


$.getScript("./Config.js");

let php = urls["php"]


// On Document Ready -> make ajax call
$(function(){

   $.ajax({
      url: urls["php"].concat("?action=getRestaurants"),
      method: "GET",
      dataType: "json",
      success: function(data){
         data.forEach(function(restaurant, index){
            let option = $("<option></option>");
            option.id = index;
            option.text(restaurant);
         });
      },
      error: function(event, request, settings){
         window.alert('AjaxError' + ' : ' + settings);
      }
   });
});