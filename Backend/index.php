<?php
    require 'dbModule.php';
    require 'config.php';


    $requestUri = $_SERVER['REQUEST_URI'];
    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestArray= [];

    #Remove Preceding /
    $requestUri = ltrim($requestUri," /");
    $requestArray = explode('/', $requestUri);
    #Check if Last Array Element is Empty, then remove it.
    if(empty($requestArray[count($requestArray)-1])){
        array_pop($requestArray);
    }

    echo '<pre>';
    print_r($requestArray);
    echo '<pre/>';

    switch ($requestUri) {
        case 'api/categories':
            
            if ($requestMethod === 'GET') {
                try {
                    $condition = []; // Empty condition to fetch all categories
                    $categories = selectWithWhereCondition($pdo, 'categories', $condition);
                    echo json_encode($categories);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to fetch categories: ' . $e->getMessage()]);
                }
            } else {
                http_response_code(405); // Method Not Allowed
                echo json_encode(['error' => 'Method not allowed']);
            }
                
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