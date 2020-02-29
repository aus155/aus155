var rail;

!function(){

	var lib = {}, routes = [];

		document.body.addEventListener("click", function(e){
			if((e.target.nodeName == "A")
				&& !e.target.target
				&& !e.target.hash
				&& (e.target.host == location.host){
				e.preventDefault();
				lib.go(e.target.pathname)
			}
		})
		addEventListener("DOMContentLoaded", function(){lib.routing()})

		addEventListener('popstate', function(){lib.routing()})


	lib.add = function(route, handler){
		routes.push([route, handler]);return lib}

	lib.routing = function(){
		for(var i = 0; i < routes.length; i++)
				if(location.pathname.match(routes[i][0])) {routes[i][1](); break}}

	lib.go = function(link){
		if( location.href != link ){
			history.pushState(null, null, link);
			lib.routing()}}
	lib.go_without_state = function(link){
		if( location.href != link ){
			history.replaceState(null, null, link);
			lib.routing()}
	}

	rail = lib
}()
