var
	mframe = document.body.getElementsByClassName('frame')[0],
	b = document.body;

rail
	.add(/^\/$/, start)
	.add(/^\/about$/, about)
	.add(/^\/@[^\/]*$/, list)
	.add(/^\/\d{2}(-\d{2}){0,2}\/?$/, date)
	.add(/^\/[^\/]*$/, page)
	.add(/.*/, page.bind(this, "start"))

function start(){
	scroll(screen.width, 0)
		axios.get("/api/start.html")
			.then(function(d){
				mframe.innerHTML = '<div class="page">' + d.data + '</div>';
				document.title = "@shark77m : Главная"})
}
function about(){
		axios.get("/api/about.html")
			.then(function(d){
				mframe.innerHTML = '<div class="page">' + d.data + '</div>';
				document.title = "@shark77m : Главная"})
}


var posts = [], last_ind = 0;

document.body.addEventListener("click", function(e){
			if((e.target.nodeName == "DIV") && (e.target.className=="add")) listAdd()
		})


function page(url){
	scroll(screen.width,0)
	var
		match_ind = snipps.indexOf(location.pathname.substr(1));

		axios.get("/api/" + (snipps[match_ind] || url) + ".html")
			.then(function(d){
				var hashtags = snipps[match_ind-4].split(","), hashtags_html='';
				for(var n=0;n<hashtags.length;n++){
					hashtags_html+='<a href="/@'+hashtags[n]+'">'+hashtags[n]+'</a>';
				}
				mframe.innerHTML = '<div class="page"><div class="info"><span>'+snipps[match_ind-5]+'</span><span>'+ hashtags_html + '</span>' + d.data + '</div>';
				document.title = "@shark77m : " + snipps[match_ind-3]})
			.catch(function(){rail.go_without_state("/")})

		}


function list(){
	generate_list();

	if(posts.length){
		var html
		= '<div class="list"><h1>'
		+ decodeURI(location.pathname).substr(2) + '</h1><ul>'
		+ list_html(5) + '</ul>';
		if(posts.length > last_ind+1) html+='<div class="add">add more</div>'
		mframe.innerHTML = html+'</div>';
	}else rail.go_without_state("/");
	
}

function date(){
	generate_timelist();

	if(posts.length){
		var html
		= '<div class="list"><h1>'
		+ decodeURI(location.pathname).substr(1) + '</h1><ul>'
		+ list_html(5) + '</ul>';
		if(posts.length > last_ind+1) html+='<div class="add">add more</div>'
		mframe.innerHTML = html+'</div>';
	}else rail.go_without_state("/");
}



function generate_list(){
	posts = []; last_ind = 0;
	for(	var path_hashtags = decodeURI(location.pathname.substr(2)).split(","),
						i = 1;i < snipps.length;i+=6)

		for(	var post_hashtags = snipps[i].split(","),
							n=0;
					(n<path_hashtags.length) && (post_hashtags.indexOf(path_hashtags[n])>-1);
					n++) if(n==path_hashtags.length-1) posts.push(i)}

function generate_timelist(){
	posts = [], path = location.pathname.substr(1);
	for(	var i=0;i<snipps.length;i+=6) if(snipps[i].indexOf(path)==0) posts.push(i+1)
}


function list_html(list_length){
	var path_hashtags = decodeURI(location.pathname.substr(2)).split(","), html = '';
	for(var i=0;last_ind<posts.length && i<list_length;i++,last_ind++){
		var post_hashtags = snipps[posts[last_ind]].split(",");
		html 
			+= '<li><div class="info"><span>'
			+	snipps[posts[last_ind]-1] + '</span>';
		if(path_hashtags.length < post_hashtags.length){
			html+='<span>'
			for(var n=0;n<post_hashtags.length;n++){
				if(path_hashtags.indexOf(post_hashtags[n])==-1)
			html
				+='<a href="/@'
				+ post_hashtags[n] +'">'
				+ post_hashtags[n] + '</a>'
			}
			html+='</span>'
		}

		html
			+= '</div><h2><a href="/' 
			+ snipps[posts[last_ind]+4] + '">' 
			+ snipps[posts[last_ind]+1] + '</a></h2>'
			+ (snipps[posts[last_ind]+3] ? '<div class="img" style="background-image: url('
				+ snipps[posts[last_ind]+3] + ')"></div><p>' : '<p>')
			+ snipps[posts[last_ind]+2] + '</p><div class="read">Читать</div></li>';
		}
		return html;
}




function listAdd(){
	console.log('a')
	mframe.getElementsByTagName("ul")[0].innerHTML += list_html(5);
	if(posts.length <= last_ind+1){
					mframe.getElementsByClassName("add")[0].parentNode.removeChild(mframe.getElementsByClassName("add")[0])
				}
}

function loader(){
	mframe.innerHTML = '<div class="loader"></div>'
}

var el = document.body.querySelector(".left"), oldY = 0, elTop = 0;
addEventListener("scroll", function(){
	elTop-=scrollY-oldY;

  if(elTop< (innerHeight-el.offsetHeight)) elTop = innerHeight - el.offsetHeight;

  if(elTop > 0) elTop = 0;

	el.style.top=elTop+"px";
	oldY=scrollY;

	el.style.marginLeft = -scrollX + "px";
})