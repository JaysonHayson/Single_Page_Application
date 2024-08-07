<?php
    
    require_once './config.php';
    require_once './sessionHandling/functions.php';

    try {
        $pdo = new PDO("mysql:host=$DBHost;dbname=$DB_DBName", DBUSERNAME, DBPASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $ConnStat = $pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS);
        if($ConnStat != 'Localhost via UNIX socket'){throw new Exception("$ConnStat");}
        
        
        // Example Call
        /*     
        print "<br>PDO:<br>";
        $condition[] = ["UID" => "1"];
        $results[] = selectWithWhereCondition($pdo,$DBTableName1,$condition);
        print "<pre>";
        print_r($results);
        print "</pre>";
        */
    } catch (PDOException $e) {
        echo 'Error: ' . $e->getMessage();
    } catch (Exception $e){
        echo 'Error: Unexpected result:' . $e->getMessage();
    }

    /**
     * selectWithWhereCondition
     * Prepares and executes a 'Select * from $table WHERE KEY = Value'
     *                                                    from $condition
     * 
     * @param  PDO      $pdo        PDO Handle
     * @param  string   $table      Name of Table in DB
     * @param  Array    $condition  Assoc Array KEY:Value Paired.
     * @return Array    Associative Multidimensional Array with results.
     */
    function selectWithWhereCondition(&$pdo,$table, $condition) {
        if (empty($table)) {
            throw new Exception("Table name cannot be empty.");
        }

        if (empty($condition) || !is_array($condition)) {
            throw new Exception("Condition must be a non-empty associative array.");
        }

        $whereClause = "";

        // if (!empty($condition)) {
        //     $whereClause = "WHERE ";
        //     $conditions = [];
        //     foreach($condition as $key => $value) {
        //         $conditions[] = "`$key` = :$key";
        //     }
        //     $whereClause .= implode(" AND ", $conditions);
        // }

        foreach($condition as $Arr){
            foreach ($Arr as $key => $value) {
                $whereClause = "`$key` = '$value'";
            }
        }
        // Constructing the SQL query
        $sql = "SELECT * FROM $table WHERE $whereClause";
        // Preparing and executing the statement
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        // Fetching all rows of the results
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }

    //##################
    //##################
    //##################
    /**
 * insertIntoTable
 * Prepares and executes an 'INSERT INTO $table (columns) VALUES (values)' statement
 * using the provided associateive array of column-value paits.
 * 
 * @param   PDO     $pdo        PDO Handle
 * @param string    $table      Name of table where data should be inserted
 * @param array     $data       Associative array of column-value pairs to be inserted into the table
 * @param bool                  Returns true or false depending on outcome
 * @param Exception             If table name or data array is empty or invalid
 * 
 */

 function insertIntoTable($pdo,$table,$data) {
    // Prüft Tabellenname auf Inhalt
    if (empty($table)) {
        throw new Exception("Table name cannot be empty");
    }

    //Prüft ob es ein gültiges nicht leeres associative array ist
    if (empty($data) || !is_array($data)) {
        throw new Exception ("Data must be a non-empty associative array");
    }

    $columns = implode(", ", array_keys($data)); // Die Spaltennamen aus dem Array extrahieren und mit ", " verbinden
    $placeholders = ":" . implode(", :", array_keys($data)); // Die Platzhalter für die Werte mit ":" vor jedem Schlüssel verbinden

    // Konstruieren der SQL-Abfrage
    $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";

    // Vorbereiten der SQL-Anweisung mit PDO
    $stmt = $pdo->prepare($sql);

    // Binden der Parameter (Platzhalter) an die tatsächlichen Werte aus dem $data-Array
    foreach ($data as $key => $value) {
        $stmt->bindValue(":$key", $value); // Den Platzhalter ":$key" auf den Wert $value binden
    }

    // Ausführen der vorbereiteten SQL-Anweisung und Rückgabe des Ergebnisses
    return $stmt->execute(); // Gibt true zurück, wenn die Ausführung erfolgreich war, ansonsten false

    }
    function updateDatasetWithWhereIDCondition($pdo, $type, $data, $id) {
        // typeValidate
        $validTypes = ['product', 'category', 'user'];
        if (empty($type) || !in_array($type, $validTypes)) {
            throw new Exception("Type name cannot be empty! Choose 'product', 'category' or 'user'");
        }
    
        // dataValidate
        if (empty($data) || !is_array($data)) {
            throw new Exception("Data must be a non-empty associative array");
        }
    
        //IDValidate
        if (empty($id)) {
            throw new Exception("ID cannot be empty");
        }
    
        //name must be at least in cause every model got a name
        if (!array_key_exists('name', $data)) {
            throw new Exception("Data array must contain a 'name' key");
        }
    
        // Setting SQL Query
        $setClause = [];
        foreach ($data as $key => $value) {
            $setClause[] = "$key = :$key";
        }
        $setClauseString = implode(", ", $setClause);
        
        $sql = "UPDATE $type SET $setClauseString WHERE id = :id";
    
        // prepare SQL
        $stmt = $pdo->prepare($sql);
    
        // binding the values to placeholders
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        $stmt->bindValue(":id", $id);
    
        //execute statement
        return $stmt->execute();
    }
    function deleteDatasetById($pdo, $type, $id) {
        // typeValidate
        $validTypes = ['product', 'category', 'user'];
        if (empty($type) || !in_array($type, $validTypes)) {
            throw new Exception("Type name cannot be empty! Choose 'product', 'category' or 'user'");
        }
    
        //IDvalidate
        if (empty($id)) {
            throw new Exception("ID cannot be empty");
        }
    
        //build SQL
        $sql = "DELETE FROM $type WHERE id = :id";
    
        // prepare Statement
        $stmt = $pdo->prepare($sql);
    
        // bind placeholders
        $stmt->bindValue(":id", $id);
    
        // execute Statement
        return $stmt->execute();
    }

    /**
     * selectAllFromTable
     * Prepares and executes a 'Select * from $table;'
     * 
     * @param  PDO      $pdo        PDO Handle
     * @param  string   $table      Name of Table in DB
     * @return Array    Associative Multidimensional Array with results.
     */
    function selectAllFromTable(&$pdo,$table){
        // Constructing the SQL query
        $sql = "SELECT * FROM $table";
        // Preparing and executing the statement
        try{
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            // Fetching all rows of the results
            return $stmt->fetchall(PDO::FETCH_ASSOC);
        }catch(PDOException $e){
            return [false,'Error fetching Categories.'];
        }
    }
 //##################
 //##################
 //##################


    /**
     * registerNewUser
     * Prepares and executes a Creation of a new user with Provided Password and username.
     * 
     * @param  PDO      $pdo        PDO Handle
     * @param  string   $userName      RequestedUserName
     * @param  string    $userPW  RequestedPW
     * @return Array    Array of (Bool, Message)
     */

     function registerNewUser(&$pdo, $userName, $userPW, $userEmail, $userFirstName, $userLastName, $userAddress) {
        $returnVar = [true, ""];
    
        try {
            // Start transaction
            $pdo->beginTransaction();
            // First statement: Insert into 'users' table
            $sql1 = "INSERT INTO users (username, password, SESS_ID) VALUES (:userName, :secPW, NULL)";
            $stmt1 = $pdo->prepare($sql1);
            $success1 = $stmt1->execute(['userName' => $userName, 'secPW' => password_hash($userPW, PASSWORD_DEFAULT)]);
    
            // Check if the insert was successful
            if ($success1) {
                // Get the user_ID of the inserted row
                $userId = $pdo->lastInsertId();
    
                // Second statement: Insert into 'customers' table
                $sql2 = "INSERT INTO customers (user_ID, firstName, lastName, email, address) VALUES (:userId, :firstName, :lastName, :email, :address)";
                $stmt2 = $pdo->prepare($sql2);
                $success2 = $stmt2->execute(['userId' => $userId, 'firstName' => $userFirstName, 'lastName' => $userLastName, 'email' => $userEmail, 'address' => $userAddress]);
    
                if ($success2) {
                    // Commit the transaction if both inserts were successful
                    $pdo->commit();
                    $returnVar[1] = 'User and customer successfully registered.';
                } else {
                    // Roll back if second insert fails
                    $pdo->rollBack();
                    $returnVar[0] = false;
                    $returnVar[1] = 'Failed to insert into customers table.';
                }
            } else {
                // Roll back if first insert fails
                $pdo->rollBack();
                $returnVar[0] = false;
                $returnVar[1] = 'Failed to insert into users table.';
            }
        } catch (PDOException $e) {
            $pdo->rollBack();
    
            $returnVar[0] = false;
    
            $eCode = $e->getCode();
            $errorMessage = $e->getMessage();
            error_log("PDOException: $errorMessage");
    
            if ($eCode == '23000') {
                $returnVar[1] = 'Username or email already in use.';
            } else {
                $returnVar[1] = 'Unknown error occurred.';
            }
        } catch (Exception $e){
            //Try to rollBack, if possible.
            $pdo->rollBack();
            $returnVar[0] = false;
            $returnVar[1] = 'Error: Unspecified uncaught Error.';
        }
    
        // Return the result
        return $returnVar;
    }

        // $returnVar = [true,""];
        // $secPW= password_hash($userPW,null);
        // $sql = "INSERT into `Users` (`Username`,`Password`) VALUES ('$userName','$secPW')";
        // try{
        //     $stmt = $pdo -> prepare($sql);
        //     $stmt -> execute();

        //     $returnVar[1] = $stmt -> fetchAll();

        //     return $returnVar;
        // }catch (PDOException $e) {
        //      $eCode = $e->getCode();
        //      $returnVar[1] = 'Unknown-Error';
        //      $returnVar[0] = false;
        //      //# Check for Known Error Duplicate UserName
        //      if($eCode == 23000){
        //         $returnVar[1] = 'Username already in use.';
        //      }
        //      return $returnVar;
        // }
    
    
    /**
    * loginUser
    * Attempts to login user with given Credentials and optional current SessToken
    * 
    * @param  PDO      $pdo         PDO Handle
    * @param  string   $userName    RequestedUserName
    * @param  string   $userPW      RequestedPW
    * @param  string   $userSessID  Optional: Current Session Token
    * @return Array    Array of (Bool, Message)
    */

    function loginUser(&$pdo,$userName,$userPW,$userSessID = ""){
        try{
            $fetchPWsql = "SELECT `password`,`SESS_ID` from `users`  WHERE `username` = '$userName'";
            $fetch_stmt = $pdo -> prepare($fetchPWsql);
            $fetch_stmt -> execute();
            $compareArr = $fetch_stmt->fetch(PDO::FETCH_ASSOC);
            if( password_verify($userPW,$compareArr['password'])  )
            {
                if($userSessID != "" && $userSessID == $compareArr[1])
                {
                    // Reuse Session, user already logged in and Session matches Servers Session.
                    return [true, "$userSessID"];
                }else{
                    // User Session =/= Server Session, close session make a new Session.
                    $newSessToken = createNewSessionToken($userName);
                    $sql = "UPDATE `users` set `SESS_ID` = '$newSessToken' WHERE `username` = '$userName'";
                    $stmt = $pdo -> prepare($sql);
                    $stmt -> execute();
                    return [true, "$newSessToken"];
                }
            }else{
                return [false, "Wrong Username / Password combination"];
            }
        }
        catch (PDOException $e) {
            $errorMessage = "DB-Error Please attempt again later.". $e;
            return [false,$errorMessage];
        }
    }

    /**
    * logoutUser
    * Logs out User with given username and Session token.
    * 
    * @param  PDO      $pdo             PDO Handle
    * @param  string   $userName        UserName to LogOut
    * @param  string   $userSessID      SessID of User Logging out
    * @return Array    Array of (Bool, Message)
    */
    function logoutUser(&$pdo,$userName,$userSessID){

        try{
            $sql = "UPDATE `users` set SESS_ID = '' WHERE `username` = '$userName'";
            $stmt = $pdo -> prepare($sql);
            $stmt -> execute();
            $results = $stmt -> fetchAll();
            return [true, "Logout Successful"];
        }catch(PDOException $e){
            $errorMessage = "DB-Error Please attempt again later.";
            return [false,$errorMessage];
        }
    }

    /**
    * authUser
    * Compares given authToken with Session in the DB.
    * 
    * @param  PDO      $pdo             PDO Handle
    * @param  string   $userName        userName to check token against
    * @param  string   $userSessID      authToken for User
    * @return Array    Array of (Bool, Message)
    */
    function authUser(&$pdo,$userName,$userSessID){
        try{
            $fetchAuthSQL = "SELECT `SESS_ID` from `users`  WHERE `username` = '$userName'";
            $stmt  = $pdo->prepare($fetchAuthSQL);
            $stmt -> execute();
            $result = $stmt -> fetch(PDO::FETCH_ASSOC);

            if($result['SESS_ID'] === $userSessID)
            {
                return [true,'Authentification Sucessful.'];
            }else
            {
                return [false,'Token rejected.'];
            }
        }catch(PDOException $e){
            $errorMessage = "DB-Error Please attempt again later.";
            return [false,$errorMessage];
        }
    }

    /**
    * getCombinedUserData
    * Fetches customerData for logged in user.
    * 
    * @param  PDO      $pdo             PDO Handle
    * @param  string   $userName        userName to grab Data for.
    * @param  string   $userSessID      authToken for User
    * @return Array    Array of (Bool, AssocArray)
    */
    function getCombinedUserData(&$pdo,$userName,$userSessID){
        try{
            $grabIDSQL      = "SELECT user_ID from `users` WHERE `username`= '$userName' AND `SESS_ID` = '$userSessID'";
            $stmt           = $pdo -> prepare($grabIDSQL);
            $stmt           -> execute();
            $result         = $stmt -> fetch(PDO::FETCH_ASSOC);
            $customerSQL    = "SELECT `firstName`,`lastName`,`address`,`email` from `customers` WHERE user_ID = ".$result['user_ID'];
            $custStmt       = $pdo -> prepare($customerSQL);
            $custStmt       -> execute();
            $customerResult = $custStmt -> fetch(PDO::FETCH_ASSOC);
            return [true,$customerResult];
        }catch(PDOException $e){
            $errorMessage = "DB-Error Please attempt again later.";
            return [false,$errorMessage];
        }
    }

?>