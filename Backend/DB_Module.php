<?php
    
    require './config.php';

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $DB_Handle = new mysqli($DBHost,
    DBUSERNAME,
    DBPASSWORD,
    $DB_DBName);

    printf($DB_Handle->host_info);
?>