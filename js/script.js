$(document).on("ready", function() {
	$("#content-musica").hide();
	//navigation
	$("#nav li").on("click", function(){
		var id = $(this).attr("id");
		var current = $(".active").first().attr("id");

		$("#"+current).attr("class", "");
		$(this).attr("class", "active");

		$("#content-"+current).toggle('slow', function(){
			$("#content-"+id).toggle('slow');
		});
	})

});
