<?php

copy("../content/blog.txt","../content/blogBackup.txt");

$file = fopen("../content/blog.txt","w");

fwrite($file,$_POST['content']);

fclose($file);

?>
