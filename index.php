<!DOCTYPE html>
<html lang="en">
<head>
<title>Yet Another Weblog</title>
<meta charset="utf-8" />
<meta name=viewport content="width=device-width, initial-scale=1" />
<link href='http://fonts.googleapis.com/css?family=Quicksand:700|PT+Sans+Caption' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="./css/style.css" />
</head>

<body>
<div class="bg">&lt;/</div>

<main class="content">

<?php

date_default_timezone_set('UTC');

$loginDialog = false;

if (isset($_GET['secretCode']) && intval($_GET['secretCode'])===intval(date('dmy'))) {
	$loginDialog = true;
}

/*if ($loginDialog) {
?>

<div class="post" id="newPost">
<p class="date" style="display:none"></p>
<article><p class="addNew"><a href="#0" onclick="admin.edit('newPost')">Add new</a></p></article>
</div>

<?php
}*/

include("./modules/PostLoader.php");
include("./modules/NavGenerator.php");
include("./modules/Init.php");

Init::start();

$postLoader = new PostLoader();
$content =  $postLoader->load();

echo NavGenerator::generateNav($postLoader->headlines);
echo $content;

?>
</main>
<script>
var wholefile = <?php echo(json_encode(array($postLoader->wholefile)));?>[0].split("@");
</script><?php


if ($loginDialog) {
?>
	<div class="login"><input type="text" id="login" autofocus></input><br /><input type="password" id="pwd"></input><br /><input type="button" value="Login" style="width:50%" onkeydown="alert(e.keyCode)" onclick="admin.verify()"></div>
	<div class="mask"></div>

	<script src="./js/admin.js"></script>

<?php
}


	?>

<script src="./js/script.js"></script>
</body>
</html>
