<?php
class PostLoader {

	private $elements = array(
		"1" => array("h1",true),
		"2" => array("h2",true),
		"3" => array("h3",true),
		"c" => array("code",true),
		"s" => array("strong",true),
		"l" => array("a","href",true),
		"i" => array("img","src","alt",false),
	);

	public $headlines = array();

	private $articleFooter = "";

	public function setFooter($content = "") {
		$footer = <<< 'EOD'
		<footer>
			<hr />
			<h2>Comments</h2>
			<div class="comments"></div>
		</footer>
		<div class="obscurator"></div>
EOD;

		$this->articleFooter = $footer."</article>\n\n<div class=\"expand\" onclick=\"comments.expand(this)\">Read on <b>&darr;</b></div>\n</div>\n\n";
	}


	private function parseElement($shortTag,$content) {

		$element =  $this->elements[$shortTag];

		if (($count = count($element)-1) == 1) 
			return "<".$element[0].">".$content."</".$element[0].">";

		$splitContent = mb_split(";",$content);

		$output = "<".$element[0];

		for ($i = 1; $i < $count; $i++) {
			if ($element[$i] === "href" && $splitContent[$i-1][0] !== "/") {
		
				if (!isset($splitContent[$count-1]))
					$splitContent[$count-1] = $splitContent[$i-1];

			$splitContent[$i-1] = "http://".$splitContent[$i-1];	
			}
			
			$output .= " ".$element[$i]."=\"".$splitContent[$i-1]."\"";
		}

		if ($element[$count])
			$output .= ">".$splitContent[$count-1]."</".$element[0].">";
		else
			$output .= " />";

		return $output;

	}

	private function parseLine($str) {
		$offset = 0;
		$substr = "";

		//print_r("$str"." - ".mb_strpos($str,"!",$offset)."\n");

		do {
			if (($pos = mb_strpos($str,"!",$offset)) === false) {
				$substr .= mb_substr($str,$offset);
				break;
			}

			if (isset($str[$pos-1]) && $str[$pos-1] === "\\") {
				$substr .= mb_substr($str,$offset,$pos-$offset-1)."!";
				$offset = $pos+1;

			} else {
				$substr .= mb_substr($str,$offset,$pos-$offset);
				$substr .= $this->parseElement($str[$pos+1],mb_substr($str,$pos+3,($newPos = mb_strpos($str,"!",$pos+1))-$pos-3));
				$offset = $newPos+1;
			}
		} while(1);

		return $substr;
	}

	private $inList = false;

	private function resetList() {
		if ($this->inList) {
			$this->inList = false;

			return "</ul>\n";
		}

		return "";
	}

	public function load($postNumber = 10000) {	

		if (!file_exists("./content/blog.txt")) {
			?><h1>Blog files doesnt exists!</h1><?php
			return;
		}

		if ($postNumber === 0)
			return;

		$elements = $this->elements;

		$current = 0;
		$counter = 0;
		$finalOutput = "";

		$file = @fopen("./content/blog.txt","r");	

		if ($file) {
			while (($buffer = fgets($file)) !== false) {
				
				$buffer = trim(mb_ereg_replace("<","&lt;",$buffer));
				$buffer = trim(mb_ereg_replace(">","&gt;",$buffer));
				
				$output = "";
				if (empty($buffer)) {
					//Do nothing!
					continue;
				} else if ($buffer[0]==="@" && ($split = mb_split(";",$buffer)) && ($b = intval($split[1]))!==$current) {
					$output = $this->resetList();
					if (($a = (++$counter > $postNumber)) || $current != 0 || $b === -1) {
						$output .= $this->articleFooter;
						if ($a || $b === -1) {
							$finalOutput .= $output;
							break;
						}
					}

			
					$current = $split[1];
					$output .= "<div class=\"post\" id=\"p"
						.$current
						."\">\n<article>\n<header>\n<p class=\"date\"><time>"
						.$split[2]
						."</time></p>\n<h1>"
						.$split[3]
						."</h1>\n</header>\n";

					array_push($this->headlines,array("p".$current,$split[3]));


				} else if ($buffer[0]==="*") {
					if (!$this->inList) {
						$this->inList = true;
						$output = "<ul>\n"."<li>".$this->parseLine(mb_substr($buffer,1))."</li>\n";
					} else
						$output = "<li>".$this->parseLine(mb_substr($buffer,1))."</li>\n";

				} else if (($len = mb_strlen($buffer)) > 4) {
					$output = $this->resetList();
					if ($buffer[0] === "!" && $buffer[1] !== "p") {
						$tag = $elements[mb_substr($buffer, 1, 1)][0];
						$str = mb_substr($buffer,3,$len-3);
					} else {
						$tag = "p";
						$str = mb_substr($buffer,(($buffer[1] === "p") ? 3 : 0));
					}

					$str = $this->parseLine($str);

					$output .= "<"
						.$tag
						.">"
						.$str
						."</"
						.$tag
						.">\n";


				} else if ($len > 1 && $buffer[1]==="c") {

					while (($buffer = fgets($file)) !== false && $buffer[0]!=="!") 
						$output .= $buffer;
	
					$output = mb_ereg_replace("<","&lt;",$output);
					$output = mb_ereg_replace(">","&gt;",$output);

					$output = $this->resetList()."<pre>\n<code>\n".$output."</code>\n</pre>\n";
				}

				$finalOutput .= $output;
		
			}
			fclose($file);
		}

		return $finalOutput;
	}

	public function __construct() {
		$this->setFooter();
	}
}
?>
