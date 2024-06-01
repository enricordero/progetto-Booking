<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione();

//$prenotazione = getValidParameter("prenotazione", $conn);
//
//$sql = "INSERT prenotazioni SET $prenotazione";
//$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();