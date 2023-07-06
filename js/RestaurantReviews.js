/* TODO

*/

// Fill restaurant selection DDL when document is ready
$(function(){
    $.ajax({
        type: "GET",
        url: urls["php"].concat("?action=getRestaurants"),
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

$('#drpRestaurant').on("change", function(){
    $.ajax({
        type: "GET",
        url: urls["php"].concat("?action=getRestaurantData&id=",$('#drpRestaurant').val()),
        dataType: "json",
        success: function(data){
            //fill form fields with restaurant data using ID
            $('#txtStreetAddress').val(data["streetAddress"]);
            $('#txtCity').val(data["city"]);
            $('#txtProvinceState').val(data["province"]);
            $('#txtPostalZipCode').val(data["postalCode"]);
            $('#txtSummary').val(data["summary"]);

            //rating as a DDL containing range of numbers using min and max from JSON

            //clear the DDL first some weird stuff is happening~!!
            for (let i = data["ratingMin"]; i < data["ratingMax"]; i++) {
                let option = $("<option></option>");
                option.val(i)
                option.text(i.toString());
                $('#drpRating').append(option);
            }

        },
        error: function(event, request, settings){
            window.alert('AjaxError' + ' : ' + settings);
        }
    });
});