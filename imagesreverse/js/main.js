$(function(){
	$('.well-item').hover(function(){
		$(this).find('.correct').children().removeClass();
		$(this).find('.opposite').children().removeClass();
		$(this).find('.correct').children().addClass('test');
		$(this).find('.opposite').children().addClass('test2');

	},function(){
		$(this).find(".correct").children().removeClass();
		$(this).find(".opposite").children().removeClass();
		$(this).find(".correct").children().addClass("test2");
		$(this).find(".opposite").children().addClass('test');
	});
})