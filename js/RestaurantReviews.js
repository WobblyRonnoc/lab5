//assign form field query selectors
const RESTAURANT = $('#drpRestaurant'); // Restaurant DDL
const STREET_ADDRESS = $('#txtStreetAddress');
const CITY = $('#txtCity');
const PROVINCE = $('#txtProvinceState');
const POSTAL_CODE = $('#txtPostalZipCode');
const SUMMARY = $('#txtSummary');
const RATING = $('#drpRating');
const SAVE_BUTTON = $('#btnSave');

function ClearForm(){
    STREET_ADDRESS.val('');
    CITY.val('');
    PROVINCE.val('');
    POSTAL_CODE.val('');
    SUMMARY.val('');
    RATING.val('');
}

// Fill restaurant selection DDL when document is ready
$(function(){
    $.ajax({
        type: "GET",
        url: urls["getRestaurants"],
        dataType: "json",
        success: function(data){
            $.each(data,function(index, value){
                let option = $("<option></option>");
                option.val(index);
                option.text(value["0"]);

                RESTAURANT.append(option);
            });
        },
        error: function(event, request, settings){
            window.alert('AjaxError' + ' : ' + settings);
        }
    });
});

RESTAURANT.on("change", function(){
    RATING.empty(); //Clear any previously generated rating DDL options
    let id = RESTAURANT.val();
    $.ajax({
        type: "GET",
        url: urls["getRestaurantData"].concat(id),
        dataType: "json",
        success: function(data){
            //fill form fields with restaurant data using ID
            STREET_ADDRESS.val(data["streetAddress"]);
            CITY.val(data["city"]);
            PROVINCE.val(data["province"]);
            POSTAL_CODE.val(data["postalCode"]);
            SUMMARY.val(data["summary"]);

            //rating as a DDL containing range of numbers using min and max from JSON
            for (let i = data["ratingMin"]; i <= data["ratingMax"]; i++) {
                let option = $("<option></option>");
                option.val(i);
                option.text(i.toString());
                RATING.append(option);
            }

            //set selected rating
            $('#drpRating option[value="'+ data["rating"] + '"]').prop('selected',true);

        },
        error: function(event, request, settings){
            window.alert('AjaxError' + ' : ' + settings);
        }
    });
});

// Submit button event listener
SAVE_BUTTON.on('click', function(){
    let formDataObj = {
        id : $('#drpRestaurant option:selected').val(),
        address : STREET_ADDRESS.val(),
        city : CITY.val(),
        province : PROVINCE.val(),
        postalCode : POSTAL_CODE.val(),
        summary : SUMMARY.val(),
        rating :  $('#drpRating option:selected').val()
    };

    $.ajax({
        type: "POST",
        url: urls["save"],
        dataType: "json",
        data: { changes : JSON.stringify(formDataObj)},
        success: function(response)
        {
            // Server Response is a JSON string containing xml file saving success or failure
            console.log("success!");
            console.log(response);
            $('#lblConfirmation').val(response);

        },
        error: function (xhr, status, error)
        {
            console.log(xhr);
            console.log(status);
            console.log(error);


            // console.log("AJAX Error:", status, error);
            // console.log("Response:", xhr.responseText);
            window.alert('AjaxError' + ' : ' + error);
        }
    });


});
