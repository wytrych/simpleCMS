<?php

class Init {
	public static function start() {
		if (!file_exists('./content/comments.xml')) {
			$init = '<?xml version=\"1.0\" encoding=\"utf-8\"?>\n'
				.'<comments>\n'
				.'<counter>0</counter>\n'
				.'</comments>';
			$file = fopen('./content/comments.xml',"w");
			if ($file)
				fwrite($file,$init);
			fclose($file);
		}

		if (!file_exists('./content/blog.txt')) 
			copy('./content/example.txt','./content/blog.txt');

	}
}

?>
