<?php
    
    require './config.php';

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

 //##################
 //##################
 //##################
?>