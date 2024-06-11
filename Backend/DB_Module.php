<?php
    
    require './config.php';

    $pdo = new PDO("mysql:host=$DBHost;dbname=$DB_DBName", DBUSERNAME, DBPASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    printf($pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS));

?>