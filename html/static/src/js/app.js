import {SomeComponent} from './components/SomeComponent';
import {SuperGif} from './lib/libgif';

$(function () {
    $('#get-started-button').on('click', scrollToGetStartedSection);
    $('.FAQ__question').on('click', function() {
        $(this).toggleClass('open');
        $(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
    });
    animateGif();
});

function scrollToGetStartedSection () {
    let offset = $('.Section--get-started').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000, 'easeInOutQuart');
}

function animateGif (cb) {
    let loadingGif = new SuperGif ({
        gif: $('.Hero-graphic__phone__loading')[0],
        show_progress_bar: false,
        loop_mode: true,//false,
        draw_while_loading: false,
        auto_play: true,
        on_end: () => {
            if (cb) {
                cb();
            }
        }
    })

    loadingGif.load ( () => {
        loadingGif.play ();
    });
}

$(function () {
    animateTerminal ();
});

function animateTerminal () {
    var lines = [
        //['$', 'brew install kryptco/tap/kr'],
        //['$', 'kr pair'],
        ['$', 'ssh root@server'],
        ['root:~#', '']
    ];
    var notificationText = 'Private key has been used. ssh root@server';

    animateLine (0);

    function animateLine (i) {
        let _l = new Line(lines[i]);

        setTimeout (() => {
            _l.animate(animateNextLine);
        }, 1000);

        function animateNextLine () {
            if (i < lines.length - 1) {
                _l.hideCursor();
                animateLine (i+1);
            } else {
                showNotification(notificationText, animationComplete);
            }
        }
    }

    function animationComplete () {
        setTimeout(() => {
            hideNotification();
            $('#terminal').html('');
            animateLine(0);
        }, 2000);
    }
}

class Line {
    constructor(line) {
        this.id = this.uniqId();
        this.line = line;
        this.theater = theaterJS();

        this.init();
    }

    init() {
        this.createElement();
        this.appendToTerminal();
        this.prepareTheater();
        this.showCursor();
        this.enableCursorBlink();
    }

    createElement() {
        console.log(this.line);
        this.$line = $('<div></div>')
            .addClass('Hero-graphic__terminal__line')
            .append('<span class="pre">'+this.line[0]+'</span>')
            .append('<div id="'+this.id+'" class="text"></div>')
            .append('<div class="cursor"></div>');
    }

    prepareTheater() {
        this.theater.addActor(this.id, {accuracy: 1, speed: 1});
    }

    animate(cb) {
        if (!this.line[1].length) {
            cb();
            return;
        }

        this.disableCursorBlink();
        this.theater
            .addScene(this.id+':'+this.line[1], 100)
            .addScene(() => {
                this.enableCursorBlink();
                cb ();
            });
    }

    appendToTerminal() {
        let $terminal = $('#terminal');
        $terminal.append(this.$line);
    }

    erase() {
        this.$line.find('.text').html('');
    }

    enableCursorBlink() {
        this.$line.find('.cursor').addClass('blink');
    }

    disableCursorBlink() {
        this.$line.find('.cursor').removeClass('blink');
    }

    hideCursor() {
        this.$line.find('.cursor').hide(0);
    }

    showCursor() {
        this.$line.find('.cursor').show(0);
    }

    remove() {
        this.$line.remove();
    }

    uniqId() {
      return 'text' + Math.round(new Date().getTime() + (Math.random() * 100));
    }

}

function showNotification(text, cb){
    $('#notification-card main').html(text);
    $('#notification-card')
        .css({
            top: '20px'
        })
        .animate({
            opacity: 1,
            top: '0px'
        }, 1000, 'easeOutCubic', () => {
            cb();
        });
};

function hideNotification(cb){
    $('#notification-card').animate({
        opacity: 0
    }, 300, 'easeInCubic', cb);
};
