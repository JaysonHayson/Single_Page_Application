<?php
    require_once 'DB_Module.php';
    require_once 'config.php';


    $requestMethod = $_SERVER['REQUEST_METHOD'];
    $requestArray= $_POST;

    header('Content-Type: application/json');

    if ($requestMethod != 'POST'){
        header("HTTP/1.0 400 Bad Request");
        echo json_encode(['error' => 'Method not allowed']);
        return;    
    }

    switch ($requestArray['Command']) {
        case 'GetProductsForCategorie':
            $cat_condition[] = ['category_id' => $requestArray['CatNr']];
            $db_results = selectWithWhereCondition($pdo,'Items',$cat_condition);
            echo json_encode($db_results);
            break;
        case 'GetAllCategories':
            $db_results=selectAllFromTable($pdo,'categories');
            echo json_encode($db_results);
            break;
        case 'registerNewUser':
            $reqUser        = $requestArray['userName'];
            $reqPass        = $requestArray['userPW'];
            $reqEmail       = $requestArray['userEmail'];
            $UserFirstName  = $requestArray['userFirstName'];
            $UserLastName   = $requestArray['userLastName'];

            if (!is_string($reqUser) ||
                !is_string($reqPass) ||
                !is_string($reqEmail) ||
                !is_string($UserFirstName) ||
                !is_string($UserLastName)) {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'Recieved Empty Values.']);
                return;
            }
            $db_results=registerNewUser($pdo, $reqUser, $reqPass, $reqEmail, $reqFirstName, $reqLastName);
            //$db_resultsCustomer = registerNewCustomer(...
            echo json_encode($db_results);
            break;
        case 'loginUser':
            $User = $requestArray['userName'];
            $Pass = $requestArray['userPW'];
            if(is_string($User && is_string($Pass))){
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'userName or userPW empty.']);
                return;
            }
            $result = loginUser($pdo,$User,$Pass);
            echo json_encode(['SUCCESS' => 'User Created']);
            break;
        case 'logoutUser':
            $User      = $requestArray['userName'];
            $SessToken = $requestArray['SessionID'];
            if(is_string($User && is_string($SessToken))){
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'userName or Session empty.']);
                return;
            }
            $result = logoutUser($pdo,$User,$Pass);
            echo json_encode(['SUCCESS' => 'logout Successfull']);
            break;
        default:
            header("HTTP/1.0 404 Not Found");
            echo json_encode(['message' => 'Endpoint not found']);
            break;

    }


?>