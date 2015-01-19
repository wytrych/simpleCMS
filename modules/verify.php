<?php

$user = "Marcin";
$pwd = "dupa";

if ($_GET['user'] === $user && $_GET['pwd'] === $pwd)
	echo json_encode(array('ok' => true));
else
	echo json_encode(array('ok' => false));

?>
