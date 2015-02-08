<?php

/*
 * This is the front page.
 * 
 * We load all modules and build the skeleton of the site.
 *
 * The boolean true passed to PostLoader and NavGenerator indicate, that we need <nav /> and <main /> tags. We won't need them to update the content, as we will be accessing them using querySelector in js/admin.js.
 *
 * @package simpleCMS
 *
 */

require_once('./view/Header.php');
require_once('./view/PostLoader.php');
require_once('./view/NavGenerator.php');
require_once('./modules/AdminPanelVerifier.php');
require_once('./view/Footer.php');

date_default_timezone_set('UTC');

if (!file_exists('./content/comments.xml') || !file_exists('./content/blog.txt')) { //Create the content files if we don't have them
	require_once('./modules/Init.php');
	Init::start();
}

$postLoader = new PostLoader(true);

echo Header::build();
echo NavGenerator::generateNav($postLoader->headlines,true);
echo $postLoader->mainContent;

AdminPanelVerifier::verify(); //Check if Admin mode was invoked

echo Footer::build($postLoader->wholefile);


