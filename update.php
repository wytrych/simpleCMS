<?php

include("./modules/PostLoader.php");
include("./modules/NavGenerator.php");

$postLoader = new PostLoader();
$content = $postLoader->load();

$output = NavGenerator::generateNav($postLoader->headlines)."\n".$content;
$wholefile = $postLoader->wholefile;

echo(json_encode(array($output,$wholefile)));

?>