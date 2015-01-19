<?php
	date_default_timezone_set('UTC');

	$myfile = simplexml_load_file("../content/comments.xml");

	$count = (int) ($myfile->counter[0])+1;
	$myfile->counter[0] = $count;

	$id = $count-1;

	$numer = (int) $_POST['odp'];

	if ($numer == -1) {
		$miejsce = (!empty($myfile->$_POST['ktory'])) ? $myfile->$_POST['ktory'] : $myfile->addChild($_POST['ktory']);
	} else  {

		$miejsce = $myfile->xpath("//comment[@id='".$numer."']")[0];
		if (!empty($miejsce->reply))
			$miejsce = $miejsce->reply;
		else {
			$miejsce = $miejsce->addChild('reply');
			$miejsce['rid'] = $id;
		}
	}

	$newComment = $miejsce->addChild('comment');
	$newComment['id'] = $id;
	$newComment->addChild('author',strip_tags($_POST['author']));
	$newComment->addChild('text',strip_tags($_POST['text']));
	$newComment->addChild('date',date('jS \of F Y h:i:s A'));

	$myfile->asXML("../content/comments.xml");
	

?>
