var comments = function(){

var el = document.querySelectorAll(".post");
var list = {};
var listNodes = [];
var ktoryPost;
	
var xmlhttp = ((window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

for (var i=0;i<el.length;i++) {
	list[el[i].id] = false;
	listNodes.push(el[i].id);
}

function collapse(co) {
	var interestingBit = co.parentNode.firstChild.nextSibling;
	interestingBit.style.maxHeight = interestingBit.scrollHeight+100+"px";
	interestingBit.style.maxHeight = "20em";
	list[co.parentNode.id] = false;
	co.innerHTML = "Read on &darr;";
	co.parentNode.querySelector(".obscurator").style.opacity = 1;
}



$$ = function(id) {
	return document.getElementById(id);
}

var para = document.createElement("p");
var newComment = document.createElement("p");
newComment.innerHTML = "<p class=\"com\"><input type=\"text\" id=\"author-1\" placeholder=\"Your name\"></input><br /><textarea rows=\"5\" cols=\"20\" id=\"text-1\" placeholder=\"Your comment\"></textarea><br /><span class=\"button\" onclick=\"wyslij(-1)\">Post comment</span></p>";

if (!Date.now()) {
	Date.now() = function() {
		var date = new Date();
		return date.getTime();
	}
}


function parseXML(element,poziom) {
	var bigPara = document.createElement("p");
	for (var i = 0; i < element.length; i++) {
		var autor = element[i].getElementsByTagName("author")[0].firstChild.nodeValue;
		var komentarz = element[i].getElementsByTagName("text")[0].firstChild.nodeValue;
		var data = element[i].getElementsByTagName("date")[0].firstChild.nodeValue;
		var numer = element[i].getAttribute("id");
		var odpowiedzi = element[i].getElementsByTagName("reply");
			
		var para = document.createElement("p");
		para.id = "par"+numer;
		para.style.marginLeft = (40)+"px";
		para.style.boxShadow = (10+5*poziom)+"px "+(10+5*poziom)+"px "+"20px black";
		para.style.paddingLeft = "10px";
		para.innerHTML = "<p class=\"com\"><span class=\"author\">"+autor+"</span><span class=\"small\"> | "+data+" | <a href=\"#0\" onclick=\"comments.setReply("+numer+")\">Reply</a></span><br />"+komentarz+"</p>";

		if (odpowiedzi.length > 0)
			para.appendChild(parseXML(odpowiedzi[0].querySelectorAll("reply[rid=\""+odpowiedzi[0].getAttribute("rid")+"\"] > comment"),poziom+1));

		bigPara.appendChild(para);
	}
	return bigPara;
}

function loadXML(gdzie) {
	var txt,x,xx,i,autor,komentarz,numer,odpowiedzi;
	var url = "./content/comments.xml?v="+Date.now();

	ktoryPost = gdzie;

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var doc = xmlhttp.responseXML.documentElement;
			if (document.all && !window.atob) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(xmlhttp.responseText, 'text/xml');
			}
			x = doc.querySelectorAll(gdzie+" > comment");
			document.querySelector("#"+gdzie+" .comments").innerHTML = "";
			document.querySelector("#"+gdzie+" .comments").appendChild(parseXML(x,0));
			document.querySelector("#"+gdzie+" .comments").appendChild(newComment);
		}
	}

	xmlhttp.open("GET",url,true);
	xmlhttp.send();

}


wyslij = function(co) {
	if ($$("author"+co).value == "" || $$("text"+co).value == "") {
		alert("Empty!");
		return;
	}


	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			loadXML(ktoryPost);
		}
	}
	xmlhttp.open("POST","./modules/saveComment.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("author="+$$("author"+co).value+"&text="+$$("text"+co).value+"&odp="+co+"&ktory="+ktoryPost);
	if (para.parentNode)
		para.parentNode.removeChild(para);
}

return {
	expand: function(co) {
		if (!list[co.parentNode.id]) {
			listNodes.forEach(function(e) {
				if (list[e])
					collapse($$(e).querySelector(".expand"));
			});
			co.parentNode.firstChild.nextSibling.style.maxHeight = "3000px";
			co.parentNode.querySelector(".obscurator").style.opacity = 0;
			co.innerHTML = "Return &uarr;";
			list[co.parentNode.id] = true;
			setTimeout(function(){loadXML(co.parentNode.id);},2000);
		} else 
			collapse(co);
	},
	setReply: function(co) {
		if (para.parentNode)
			para.parentNode.removeChild(para);
		if (newComment.parentNode)
			newComment.parentNode.removeChild(newComment);

		para.innerHTML = "<p id=\"here\" class=\"com\"><input type=\"text\" id=\"author"+co+"\" placeholder=\"Your name\"></input><br /><textarea rows=\"5\" cols=\"20\" id=\"text"+co+"\" placeholder=\"Your comment\"></textarea><br /><span class=\"button\" onclick=\"wyslij("+co+")\">Post comment</span></p>";
		$$("par"+co).appendChild(para);
		location.hash = "#here";
	}
}

}();
