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
            $db_results = selectWithWhereCondition($pdo,'items',$cat_condition);
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
            $reqFirstName   = $requestArray['userFirstName'];
            $reqLastName    = $requestArray['userLastName'];
            $reqAddress      = $requestArray['userAddress'];

            if (
                (!is_string($reqUser)       || strlen($reqUser)<1)      //Frontend may provide an Empty string, make sure it doesn't;
                ||
                (!is_string($reqPass)       || strlen($reqPass)<1)      //Frontend may provide an Empty string, make sure it doesn't;
                ||
                (!is_string($reqEmail)      || strlen($reqEmail)<1)     //Frontend may provide an Empty string, make sure it doesn't;
                ||
                !is_string($reqFirstName)
                ||
                !is_string($reqLastName)
                ||
                !is_string($reqAddress)
                )
            {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'Recieved Empty Values.']);
                return;
            }
            $db_results=registerNewUser($pdo, $reqUser, $reqPass, $reqEmail, $reqFirstName, $reqLastName, $reqAddress);
            //$db_resultsCustomer = registerNewCustomer(...
            echo json_encode($db_results);
            break;
        case 'loginUser':
            $User        = $requestArray['userName'];
            $Pass        = $requestArray['userPW'];
            $userSession = $requestArray['Session_ID'];
            if(
                (!is_string($User) || strlen($User)<1)
                 ||
                (!is_string($Pass) || strlen($Pass)<1)
              )
            {
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'userName or userPW empty.']);
                return;
            }
            if( (is_string($userSession) || strlen($userSession)>0)){ //Existing Session
                $result = loginUser($pdo,$User,$Pass,$userSession);
            }else{
                $result = loginUser($pdo,$User,$Pass);                //No SessionGiven
            }
            echo json_encode($result);
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
        case 'authUser':
            $User      = $requestArray['userName'];
            $SessToken = $requestArray['authToken'];
            if(is_string($User && is_string($SessToken))){
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'userName or Session empty.']);
                return;
            }
            $result = authUser($pdo,$User,$SessToken);
            echo json_encode($result);
            break;
        case 'getUserData':
            $User       = $requestArray['userName'];
            $SessToken  = $requestArray['authToken'];
            if(is_string($User && is_string($SessToken))){
                header("HTTP/1.0 400 Bad Request");
                echo json_encode(['error' => 'userName or Session empty.']);
                return;
            }
            $result = getCombinedUserData($pdo,$User,$SessToken);
            echo json_encode($result);
            break;
        default:
            header("HTTP/1.0 404 Not Found");
            echo json_encode(['message' => 'Endpoint not found']);
            break;

    }


?>