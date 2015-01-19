<?php

class NavGenerator {
	public static function generateNav($headlines) {
		$output = "<nav class=\"menu\">\n<p class=\"title\">Content</p>\n";

		foreach ($headlines as $item)
			$output .= "<p><a href=\"#".$item[0]."\">".$item[1]."</a></p>\n";
		$output .="</nav>\n";

		return $output;
	}
}

?>
