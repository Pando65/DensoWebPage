$(document).on("ready", function() {
	//navigation
	$("#nav li").on("click", function(){
		var id = $(this).attr("id");
		$("#nav li").attr("class", "");
		$(this).attr("class", "active");

		$("#content-noticias").fadeOut('slow');
		$("#content-musica").fadeOut('slow');
		$("#content-miembros").fadeOut('slow');
		$("#content-fechas").fadeOut('slow');
		$("#content-contacto").fadeOut('slow');

		$("#content-"+id).show('slow');
	})

});
