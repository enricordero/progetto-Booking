<?php
header("Content-type: application/json; charset=utf-8");
require_once("mysqli.php");
$conn = apriConnessione();

$codHotel = getValidParameter("codHotel", $conn);
$tipoStanza = getValidParameter("tipoStanza", $conn);
switch ($tipoStanza) {
    case "singola":
        $columnName = "singolePrenotate";
        break;
    case "doppia":
        $columnName = "doppiePrenotate";
        break;
    case "tripla":
        $columnName = "triplePrenotate";
        break;
    case "quadrupla":
        $columnName = "quadruplePrenotate";
        break;
    case "suite":
        $columnName = "suitesPrenotate";
        break;
    default:
        break;
}

$sql = "UPDATE hotel 
        SET $columnName = $columnName + 1
        WHERE codHotel = $codHotel";

$data = eseguiQuery($conn, $sql);

http_response_code(200);
echo (json_encode($data));

$conn->close();
