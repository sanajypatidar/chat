
<?php
$servername = "localhost";
$username = "root";
$password = "test1@";
$dbname = "chat";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
$rt=array();
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}






 ?>

