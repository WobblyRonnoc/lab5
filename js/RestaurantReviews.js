//assign form field query selectors
const RESTAURANT = $('#drpRestaurant'); // Restaurant DDL
const STREET_ADDRESS = $('#txtStreetAddress');
const CITY = $('#txtCity');
const PROVINCE = $('#txtProvinceState');
const POSTAL_CODE = $('#txtPostalZipCode');
const SUMMARY = $('#txtSummary');
const RATING = $('#drpRating');
const SAVE_BUTTON = $('#btnSave');
const SUCCESS_ALERT = $('#lblConfirmation');

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

    SUCCESS_ALERT.hide(); // hide save success/error alert

    $.ajax({
        type: "GET",
        url: urls["getRestaurants"],
        dataType: "json",
        success: function(data){
            $.each(data,function(index, value){
                let option = $("<option></option>");
                option.val(index);
                option.text(value.toString());
                RESTAURANT.append(option);
            });
        },
        error: function(event, request, settings){
            window.alert('AjaxError' + ' : ' + settings);
        }
    });
});

RESTAURANT.on("change", function(){

    SUCCESS_ALERT.hide("slow"); // hide save success/error alert

    RATING.empty(); //Clear any previously generated rating DDL options
    let id = RESTAURANT.val().toString();
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
        id : RESTAURANT.val(),
        address : STREET_ADDRESS.val(),
        city : CITY.val(),
        province : PROVINCE.val(),
        postalCode : POSTAL_CODE.val(),
        summary : SUMMARY.val(),
        rating :  RATING.val()
    };

    if (RESTAURANT.val() === '-1'){
        SUCCESS_ALERT.text("Select a restaurant before saving!")
        SUCCESS_ALERT.removeClass("alert-success");
        SUCCESS_ALERT.addClass("alert-danger");
        SUCCESS_ALERT.show("fast");
    } else {
        $.ajax({
            type: "POST",
            url: urls["save"],
            dataType: "json",
            data: { changes : JSON.stringify(formDataObj)},
            success: function(fileSaved)
            {
                if (fileSaved["success"]){
                    SUCCESS_ALERT.text("Changes Saved!")
                    SUCCESS_ALERT.addClass("alert-success");
                    SUCCESS_ALERT.removeClass("alert-danger");
                    SUCCESS_ALERT.show("slow");
                } else {
                    SUCCESS_ALERT.text("Changes failed to save!")
                    SUCCESS_ALERT.removeClass("alert-success");
                    SUCCESS_ALERT.addClass("alert-danger");
                    SUCCESS_ALERT.show("fast");
                }


            },
            error: function (xhr, status, error)
            {
                window.alert('AjaxError' + ' : ' + error);
            }
        });
    }






});
