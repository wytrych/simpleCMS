var admin = function(){
	var xmlhttp = ((window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

	return {
		verify: function() {
			var url = "./modules/verify.php?user="+document.getElementById('login').value+"&pwd="+document.getElementById('pwd').value;	

			xmlhttp.onreadystatechange = function() {	
				if(xmlhttp.readyState==4 && xmlhttp.status==200) {
					console.log(url);
					console.log(xmlhttp.response.ok);
					if (xmlhttp.response.ok)
						alert('nie ma lipy!');
					else
						alert("lipa!");
				}
			}
			xmlhttp.open("GET",url,true);
			xmlhttp.responseType = "json";
			xmlhttp.send();

		}
	}

}();