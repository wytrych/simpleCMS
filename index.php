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
include("./modules/PostLoader.inc");
include("./modules/NavGenerator.inc");
include("./modules/Init.inc");

Init::start();

$postLoader = new PostLoader();

$content =  $postLoader->load();

echo NavGenerator::generateNav($postLoader->headlines);
echo $content;


	?>

</main>
<script src="./js/script.js"></script>
</body>
</html>
