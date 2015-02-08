<?php

class NavGenerator {
	public static function generateNav($headlines,$skeleton = false) {
		$output = '<ul><li class="title">Content</li>';

		foreach ($headlines as $item)
			$output .= "<li><a href=\"#$item[0]\">$item[1]</a></li>";

		if ($skeleton)
			return "<nav class=\"menu\">$output</nav>";

		return $output;
	}
}

?>
