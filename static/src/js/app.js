
$(document).ready(function () {
	$('#get-started-button').on('click', scrollToGetStartedSection);
	$('.FAQ__question').on('click', function () {
		$(this).toggleClass('open');
		$(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
	});
	$('.Section--jobs__jobs__job').on('click', function () {
		$(this).toggleClass('open');
	});
	$('.Page-header__menu-button').on('click', function () {
		let $p = $(this).parent();
		if ($p.hasClass('open')) {
			$('html, body').css('overflow', 'initial');
		} else {
			$('html, body').css('overflow', 'hidden');
		}
		$p.toggleClass('open');
	});
	$('.Page-header__overlay').on('click', function () {
		let $p = $(this).parent();
		$('html, body').css('overflow', 'initial');
		$p.toggleClass('open');
	});
});

function scrollToGetStartedSection() {
	let offset = $('.Section--get-started').offset().top;

	$('html, body').animate({
		scrollTop: offset
	}, 1000, 'easeInOutQuart');
}

