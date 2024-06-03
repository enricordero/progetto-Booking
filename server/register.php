<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione();

$username = getValidParameter("username", $conn);
$password = getValidParameter("password", $conn);
$citta = getValidParameter("citta", $conn);

$sql = "INSERT INTO utenti (username, psw, citta) VALUES ('$username', '$password', '$citta')";

$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();