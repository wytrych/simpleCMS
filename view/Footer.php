<?php
class Footer {
	public static function build($wholefile) {
?>

</body>
<script>
var wholefile = <?php echo(json_encode(array($wholefile)));?>[0].split("@");
</script>

<script src="./js/script.js"></script>
</html>

<?php
	}
}

