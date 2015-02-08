<?php

class AdminPanelVerifier {
	public static function verify() {
		
		if (isset($_GET['secretCode']) && intval($_GET['secretCode'])===intval(date('dmy'))) {
			require_once("./view/LoginBox.php");
			LoginBox::build();
		}
	}
}

