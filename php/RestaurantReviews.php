<?php
function GetXmlObject() : SimpleXMLElement{
    $xmlFilePath = parse_ini_file("../Lab5.ini")["xmlFilePath"];
    return simplexml_load_file($xmlFilePath);
}

function GetRestaurantNames(SimpleXMLElement $restaurantData): array {
    $optionsArray = [];
    $restaurants = $restaurantData->restaurants->restaurant; // List of restaurant objects


    foreach ($restaurants as $restaurant){
        $optionsArray[] = $restaurant->name; // Append each restaurant's name to the array
    }
    return $optionsArray;
}

$restaurantReviews = GetXmlObject();

// on ready ajax response to fill restaurant select options
if (isset($_GET["action"]) && $_GET["action"] == "getRestaurants") {
    $names = GetRestaurantNames($restaurantReviews);
    echo json_encode($names);
}

if (isset($_GET["action"]) && isset($_GET["id"]) && $_GET["action"] == "getRestaurantData") {


    $id = (int)$_GET["id"];

    $restaurant = $restaurantReviews->restaurants->restaurant[$id]; // Get the restaurant specific to the received ID

    // convert XML data -> dictionary
    $data = [];

    //Address Data
    $address = $restaurant->address;
    $data["streetAddress"] = $address->streetNumber . " " . $address->streetName;
    $data["city"] = (string)$address->city;
    $data["province"] = (string)$address->province;
    $data["postalCode"] = (string)$address->postalCode;

    //Review Data
    $review = $restaurant->review;
    $data["summary"] = (string)$review->summary;
    $data["rating"] = (int)$review->rating;
    $data["ratingMin"] = (int)$review->rating['min'];
    $data["ratingMax"] = (int)$review->rating['max'];

    // respond with data as JSON string
    echo json_encode($data);
}




