<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione();

$codHotel = getValidParameter("codHotel", $conn);
$codUtente = getValidParameter("codUtente", $conn);
$stelle = getValidParameter("stelle", $conn);
$testoRecensione = getValidParameter("testoRecensione", $conn);
$dataRec = getValidParameter("dataRec", $conn);

$sql = "INSERT INTO recensioni (codHotel, codUtente, stelle, testoRecensione, dataRec) VALUES ('$codHotel', '$codUtente', $stelle, '$testoRecensione', '$dataRec')";

$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();