<?php

class Init {
	public static function start() {
		if (!file_exists("./content/comments.xml")) {
			$init = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
				."<comments>\n"
				."<counter>0</counter>\n"
				."</comments>";
			$file = fopen("./content/comments.xml","w");
			if ($file)
				fwrite($file,$init);
			fclose($file);
		}

		if (!file_exists("./content/blog.txt")) {
			$init = "@;1;2000-01-01;Start your blog!\n\n"
				."No posts written !s yet!.\n\n"
				."@;-1;";

			$file = fopen("./content/blog.txt","w");
			if ($file)
				fwrite($file,$init);
			fclose($file);
		}

	}
}

?>
