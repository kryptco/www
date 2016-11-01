import {SomeComponent} from './components/SomeComponent';
import {AnimatedGif} from './components/AnimatedGif';
import {AnimatedTerminal} from './components/AnimatedTerminal';
import {actionSet} from './data/ActionSet';

var started = false;

var initFn = function() {
	if (started) {
		return;
	}
	started = true;
	$('#phoneGIF').attr('src', "https://s3.amazonaws.com/kryptco-assets/krypt-gif.gif")
    $('#get-started-button').on('click', scrollToGetStartedSection);
    $('.FAQ__question').on('click', function() {
        $(this).toggleClass('open');
        $(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
    });


    let actions = [
        {
            lines: [['$', 'ssh root@server', true],
                ['root:~#', '', true, 1000],
			],
            notificationText: 'Your private key was used: <br> <span style="">ssh root@server</span>',
            notificationIndex: 0,
			notificationDelay: 6000,
        },
        {
            lines: [['$', 'git pull origin master', true],
            ['', 'Updating c21fc5a..3b8a0a5', false, 10],
            ['', '7 files changed, done.', false],
            ['$', '', true, 4000]],
            notificationIndex: 0,
            notificationText: 'Your private key was used: <br> <span style="">git pull github:hello.git</span>',
			notificationDelay: 1000,
        }
    ]

    animateAction(0);

    function animateAction (i) {
        let a = actions[i];
        let animatedTerminal = new AnimatedTerminal (a.lines, {notificationIndex: 0, notificationText: a.notificationText, notificationDelay: a.notificationDelay});
        animatedTerminal.startAnimation( () => {
            (i == actions.length-1 ? animateAction(0) : animateAction(i+1) );
        });
    }
};


$(document).ready(function() {
	$('#phoneGIF').attr('src', "https://s3.amazonaws.com/kryptco-assets/krypt-gif.gif")
		$("#phoneGIF").load(initFn);
	setTimeout(function() {
		initFn();
	}, 6000);
});

function scrollToGetStartedSection () {
    let offset = $('.Section--get-started').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000, 'easeInOutQuart');
}
