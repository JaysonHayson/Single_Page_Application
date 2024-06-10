<?php
    
    require './config.php';

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $DB_Handle = new mysqli($DBHost,
    DBUSERNAME,
    DBPASSWORD,
    $DB_DBName);

    printf($DB_Handle->host_info);


    function fireSQLStatement($DB_Handle,$Sql_Statement){
       $preppedStatement = $DB_Handle->prepare("$Sql_Statement");
       $preppedStatement -> execute();
       $result = $preppedStatement->get_result();
       return $result;
    }
?>