import {SomeComponent} from './components/SomeComponent';

$(function () {
    $('#get-started-button').on('click', scrollToGetStartedSection);
});

function scrollToGetStartedSection () {
    let offset = $('.Section--get-started').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000, 'easeInOutQuart');
}
