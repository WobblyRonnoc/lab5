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
if (isset($_GET["action"]) && $_GET["action"] == "getRestaurants"){
    $names = GetRestaurantNames($restaurantReviews);
    echo json_encode($names);
}