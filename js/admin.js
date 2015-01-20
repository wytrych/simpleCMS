var admin = function(){

	var xmlhttp = ((window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

	var contentHolder = {};

	var postCount;

	document.querySelector(".login").onkeypress = function(e) {
		if (e.keyCode === 13)
			admin.verify();
	}

	function addEditLink() {
		var posts = document.querySelectorAll(".post");
		for (var i = 0; i<posts.length; i++) {
			var post = posts[i].querySelector(".date");
			var editLink = document.createElement("p");
			editLink.innerHTML = "<a href=\"#0\" onclick=\"admin.edit(\'"+posts[i].id+"\')\">Edit</a>&nbsp;|&nbsp;" +
						"<a href=\"#0\" onclick=\"admin.deletePost(\'"+posts[i].id+"\')\">Delete</a>";
			post.appendChild(editLink);	
		}
	}

	function addNewPostLink() {
		addDialog = document.createElement("div");
		addDialog.className = "post";
		addDialog.id = "newPost";
		addDialog.innerHTML = "<p class=\"date\" style=\"display:none\"></p><article style=\"max-height:300em\"><p class=\"addNew\"><a href=\"#0\" onclick=\"admin.edit('newPost')\">Add new</a></p></article>";
		document.querySelector("main").insertBefore(addDialog,document.querySelector("main").firstChild);
	}

	function removeDialog() {
		var box = document.querySelector(".login");
		var mask = document.querySelector(".mask")

		box.className = "loginGone";
		mask.className = "maskGone";

		if (box.addEventListener) {
			box.addEventListener("transitionend",function(){box.style.display="none";});
			mask.addEventListener("transitionend",function(){mask.style.display="none";});
		}

		if (document.all && !window.atob) {
			//IE 9 or older
			box.style.display="none";
			mask.style.display="none";
		}

	}

	function splitBlogContent(content) {
		contentHolder = {};

		var workingIndex=0;
		var postNumber;
		var currentPost;
		var date,title,article;
		for (var i = 1; i < content.length-1; i++) {
			currentPost = content[i].substr(1);
			workingIndex = currentPost.indexOf(";");
			postNumber = parseInt(currentPost.substr(0,workingIndex),10);

			currentPost = currentPost.substr(workingIndex+1);
			workingIndex = currentPost.indexOf(";");
			date = currentPost.substr(0,workingIndex);

			currentPost = currentPost.substr(workingIndex+1);
			workingIndex = currentPost.indexOf("\n");
			title = currentPost.substr(0,workingIndex);

			article = currentPost.substr(workingIndex+1);

			contentHolder["p"+postNumber] = {"date":date,"title":title,"article":article};

		}
		postCount = content[content.length-1].split(";")[2];


	}

	function transmit(content) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						splitBlogContent(xmlhttp.response[1].split("@"));
						document.querySelector("main").innerHTML = xmlhttp.response[0];
						addEditLink();
						addNewPostLink();

					}
				}
				xmlhttp.open("POST","./update.php",true);
				xmlhttp.responseType = "json";
				xmlhttp.send();
			}
		}

		xmlhttp.open("POST","./modules/savePost.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("content="+content);
	}

	function expandAllPosts() {
		var articles = document.querySelectorAll("article");
		for (var i = 0; i < articles.length; i++)
			articles[i].style.maxHeight = "200em";

		articles = document.querySelectorAll(".obscurator");
		for (var i = 0; i < articles.length; i++)
			articles[i].style.display = "none";

	}

	return {
		verify: function() {
			var url = "./modules/verify.php?user="+document.getElementById('login').value+"&pwd="+document.getElementById('pwd').value;	

			xmlhttp.onreadystatechange = function() {	
				if(xmlhttp.readyState==4 && xmlhttp.status==200) {
					if (xmlhttp.response.ok) {
						addEditLink();
						addNewPostLink();
						removeDialog();
						splitBlogContent(wholefile);
						expandAllPosts();
					} else
						alert("Bad credentials!");
				}
			}
			xmlhttp.open("GET",url,true);
			xmlhttp.responseType = "json";
			xmlhttp.send();

		},
		
		loadSource: function(postNumber) {
		},

		edit: function(co) {
			co = document.getElementById(co);
			if (co.id !== "newPost") 
				content = contentHolder[co.id];
			else
				content = {title: "Type the title here",article: "Type in some content"};

			article = co.querySelector("article");
			article.style.maxHeight = "200em";

			article.innerHTML ="<form id=\"edit\"><b class=\"inputDesc\">Title:</b><input type=\"text\" id=\"postTitle\" value=\""+content.title+"\" /><br />"
				+ "<textarea style=\"width:80%;height:20em\">"+content.article+"</textarea><br />"
				+ "<input type=\"hidden\" id=\"postId\" value=\""+co.id+"\" />"
				+ "<input type=\"button\" value=\"Save changes\" onclick=\"admin.send()\" /></form>";
			
		},

		deletePost: function(postId) {
			var newContent = "";

			for (post in contentHolder) {
				if (post !== postId) {
					currentPost = contentHolder[post];
					newContent += "@;"+post.substr(1)+";"+currentPost.date+";"+currentPost.title+"\n"+currentPost.article.trim()+"\n";
				} 
			}

			newContent += "@;-1;"+postCount+";\n";

			transmit(newContent);

		},

		send: function() {
			
			var newContent = "";
			var form = document.getElementById("edit");
			var editedPost = form.elements[2].value;
			var date = new Date();

			var month = date.getMonth()+1;
			if (month < 10)
				month = "0"+month;

			var day = date.getDate();
			if (day < 10)
				day = "0"+day;

			var dateString = date.getUTCFullYear()+"-"+month+"-"+day;
			
			if (editedPost === "newPost")
				newContent += "@;"+(++postCount)+";"+dateString+";"+form.elements[0].value+"\n"+form.elements[1].value.trim()+"\n";

			for (post in contentHolder) {
				if (post !== editedPost) {
					currentPost = contentHolder[post];
					newContent += "@;"+post.substr(1)+";"+currentPost.date+";"+currentPost.title+"\n"+currentPost.article.trim()+"\n";
				} else {
					newContent += "@;"+post.substr(1)+";"+dateString+";"+form.elements[0].value+"\n"+form.elements[1].value.trim()+"\n";
				}
			}
			newContent += "@;-1;"+postCount+";\n";

			transmit(newContent);

		}

	}

}();
