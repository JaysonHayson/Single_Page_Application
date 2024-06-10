<?php
/* Debug File */

error_reporting(E_ALL);

require './DB_Module.php';

echo "<br>DB_Module Sucessfully Loaded.<br>";

echo (fireSQLStatement($DB_Handle,"Select * From Users WHERE UID = 1"));

echo "<br>EOF<br>";

?>