/* TODO

*/

//$.getScript("js/Config.js");

// On Document Ready -> make ajax call
$(function(){
   $.ajax({
      type: "GET",
      url: urls["php"] + "?action=getRestaurants",
      dataType: "json",
      success: function(data){
         $.each(data,function(index, value){
            let option = $("<option></option>");
            option.val(index)
            option.text(value["0"]);

            $('#drpRestaurant').append(option);
         });
      },
      error: function(event, request, settings){
         window.alert('AjaxError' + ' : ' + settings);
      }
   });
});