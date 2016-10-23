import {SomeComponent} from './components/SomeComponent';
import {AnimatedGif} from './components/AnimatedGif';
import {AnimatedTerminal} from './components/AnimatedTerminal';


$(function () {
    $('#get-started-button').on('click', scrollToGetStartedSection);
    $('.FAQ__question').on('click', function() {
        $(this).toggleClass('open');
        $(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
    });
    // AnimatedGif();

    let lines = [
        //['$', 'brew install kryptco/tap/kr'],
        //['$', 'kr pair'],
        ['$', 'ssh root@server'],
        ['root:~#', '']];

    lines = [
        ['$', 'git pull origin master', true],
        ['', 'Updating c21fc5a..3b8a0a5', false, 10],
        ['', '7 files changed, done.', false],
        ['$', '', true, 4000]
    ];

    let animatedTerminal = new AnimatedTerminal (lines);
    animatedTerminal.startAnimation();
});

function scrollToGetStartedSection () {
    let offset = $('.Section--get-started').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000, 'easeInOutQuart');
}
