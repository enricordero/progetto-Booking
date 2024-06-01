<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione();

$username = getValidParameter("username", $conn);
$password = getValidParameter("password", $conn);

$sql = "SELECT * 
        FROM utenti
        WHERE username = '$username'
        AND psw = '".md5($password)."'";
$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();