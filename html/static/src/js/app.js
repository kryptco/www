import {SomeComponent} from './components/SomeComponent';
import {AnimatedGif} from './components/AnimatedGif';
import {AnimatedTerminal} from './components/AnimatedTerminal';
import {actionSet} from './data/ActionSet';


$(function () {
    $('#get-started-button').on('click', scrollToGetStartedSection);
    $('.FAQ__question').on('click', function() {
        $(this).toggleClass('open');
        $(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
    });


    let actions = [
        {
            lines: [['$', 'ssh root@server', true],
                ['root:~#', '', true]],
            notificationText: 'Your private key was used: <br> <span style="">ssh root@server</span>',
            notificationIndex: 0
        },
        {
            lines: [['$', 'git pull origin master', true],
            ['', 'Updating c21fc5a..3b8a0a5', false, 10],
            ['', '7 files changed, done.', false],
            ['$', '', true, 4000]],
            notificationIndex: 0,
            notificationText: 'Your private key was used: <br> <span style="">git pull github:hello.git</span>'
        }
    ]

    animateAction(0);

    function animateAction (i) {
        let a = actions[i];
        let animatedTerminal = new AnimatedTerminal (a.lines, {notificationIndex: 0, notificationText: a.notificationText});
        animatedTerminal.startAnimation( () => {
            (i == actions.length-1 ? animateAction(0) : animateAction(i+1) );
        });
    }
});

function scrollToGetStartedSection () {
    let offset = $('.Section--get-started').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000, 'easeInOutQuart');
}
