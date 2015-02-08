<?php
class LoginBox {
	public static function build() {
?>

	<div class="login"><input type="text" id="login" autofocus></input><br /><input type="password" id="pwd"></input><br /><input type="button" value="Login" style="width:50%" onclick="admin.verify()"></div>
	<div class="mask"></div>

	<script src="./js/admin.js"></script>

<?php
	}
}

