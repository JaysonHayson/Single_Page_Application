<?php
    require 'DB_Module.php';
    require 'config.php';


    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestArray= $_POST;

    header('Content-Type: application/json');

    if ($requestMethod != 'POST'){
        echo json_encode(['error' => 'Method not allowed']);
        return;    
    }

    switch ($requestArray['Command']) {
        case 'GetProductsForCategorie':
            $cat_condition[] = ['id' => $requestArray['CatNr']];
            $db_results = selectWithWhereCondition($pdo,'categories',$cat_condition);
            echo json_encode($db_results);
            break;
        case 'GetAllCategories':
            $db_results=selectAllFromTable($pdo,'categories');
            echo json_encode($db_results);
            break;
        default:
                header("HTTP/1.0 404 Not Found");
                echo json_encode(['message' => 'Endpoint not found']);
            break;

    }


?>