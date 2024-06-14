<?php

    $requestUri = $_SERVER['REQUEST_URI'];
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestArray[]= '';

    #Remove Preceding /
    $requestUri = ltrim($requestUri," /");
    $requestArray = explode('/', $requestUri);
    #Check if Last Array Element is Empty, then remove it.
    if(is_null($requestArray[count($requestArray)])){
        array_pop($requestArray);
    }

    echo '<pre>';
    print_r($requestArray);
    echo '<pre/>';

    switch ($requestUri) {
        case 'GetAllCategories':
                echo 'GetAllCategories';
            break;
        case 'GetProductForCategorie':
                echo 'GetProductForCategorie';
            break;
        default:
                echo 'Nah';
                header("HTTP/1.0 404 Not Found");
                echo json_encode(['message' => 'Endpoint not found']);
            break;

    }


?>