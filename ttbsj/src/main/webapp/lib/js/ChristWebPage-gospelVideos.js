$(function(){
/*use index adapt to the classes*/
	$(".websiteUrl").mouseenter(function(){
		var index=$(".websiteUrl").index(this);		
		$(".websiteUrl:eq("+index+")").css("box-shadow","3px 3px 5px #63AC61");
	});
	$(".websiteUrl").mouseleave(function(){
		$(".websiteUrl").css("box-shadow","");
	});

})