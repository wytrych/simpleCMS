<?php

require_once("./view/PostLoader.php");
require_once("./view/NavGenerator.php");

$postLoader = new PostLoader();

echo(json_encode(array(NavGenerator::generateNav($postLoader->headlines), $postLoader->mainContent, $postLoader->wholefile)));

