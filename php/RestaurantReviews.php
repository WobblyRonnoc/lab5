<?php
//Set xml filepath from .ini
$xmlFilePath = parse_ini_file("../Lab5.ini")["xmlFilePath"];

function GetXmlObject() : SimpleXMLElement{
    global $xmlFilePath;
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

//assigned all keys to avoid errors while supplying empty strings for default restaurant DDL option
function EmptyDataArray(): array{
    $data = [];

    //Address Data
    $data["streetAddress"] = '';
    $data["city"] = '';
    $data["province"] = '';
    $data["postalCode"] = '';

    //Review Data
    $data["summary"] = '';
    $data["rating"] = '';
    $data["ratingMin"] = '';
    $data["ratingMax"] = '';

    return $data;
}

$restaurantReviews = GetXmlObject();

// on ready ajax response to fill restaurant select options
if (isset($_GET["action"]) && $_GET["action"] == "getRestaurants") {
    $names = GetRestaurantNames($restaurantReviews);
    echo json_encode($names);
}

if (isset($_GET["action"]) && isset($_GET["id"]) && $_GET["action"] == "getRestaurantData") {
    $id = (int)$_GET["id"];
    if ($id == -1){
        // respond with data as JSON string//
        echo json_encode(EmptyDataArray());
       return;
    }

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

//if(isset($_GET["action"]) && $_GET["action"] == "save"){
//    $json ='{"id":"1","address":"1387557885 Woodroffe Avenue","city":"Montreal","province":"QC","postalCode":"K2G 1V8","summary":"The food is always consistent. A good variety of dim sum, sushi, Chinese and even Vietnamese dishes. The service is quick and the food is plentiful. We sat down last night and within seconds of turning in our first order, the plates were on the table! The teriyaki dishes had the right amount of sauce and werent sickeningly sweet. The chicken, fish, and beef were perfectly cooked. The makirolls were neatly rolled, cut properly and seasoned well. Loved the General Tao chicken, the steamed BBQ pork buns, the eel sushi and the lovely eggplant. We will be going back again! I would highly recommend it.","rating":"5"}';
//
//    $postData = json_decode($json, true);
//
//    //Updated restaurant data
//    $id = $postData["id"];
//    //split the street name and number because my xml saves them separately...
//    $address = $postData["address"];
//    $parts = explode('+', $address);
//    $streetNumber = $parts[0];
//    $streetName = implode(' ', array_slice($parts, 1));
//
//    $city = $postData["city"];
//    $province = $postData["province"];
//    $postalCode = $postData["postalCode"];
//    $summary = $postData["summary"];
//    $rating = $postData["rating"];
//
//    foreach ($postData as $i){
//        print "$i";
//    }
//
//}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] = "save") {
    $postData = json_decode($_POST["changes"], true);

    //Updated restaurant data
    $id = $postData["id"];
    //split the street name and number because my xml saves them separately...
    $address = $postData["address"];
    $parts = explode('+', $address);
    $streetNumber = $parts[0];
    $streetName = implode(' ', array_slice($parts, 1));

    $city = $postData["city"];
    $province = $postData["province"];
    $postalCode = $postData["postalCode"];
    $summary = $postData["summary"];
    $rating = $postData["rating"];

    // Apply changes to XML file
    $xml = GetXmlObject();

    $restaurant = $xml->restaurants->restaurant[$id];
    $restaurant->address->streetName = $streetName;
    $restaurant->address->streetNumber = $streetNumber;
    $restaurant->address->city = $city;
    $restaurant->address->province = $province;
    $restaurant->address->postalCode = $postalCode;
    $restaurant->review->summary = $summary;
    $restaurant->review->rating = $rating;

    // Save modified XML to file
    $dom = dom_import_simplexml($xml)->ownerDocument;
    $saveResult = $dom->save($xmlFilePath);

    $response = [];

    //Echo server response
    if ($saveResult !== false) {
        $response["message"] = "Success!";
    } else {
        $response["message"] = "Failure!";
    }

//    echo $response["message"];
    echo json_encode($response);
}


