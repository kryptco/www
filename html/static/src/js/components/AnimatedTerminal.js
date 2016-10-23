import {Line} from './Line';

export class AnimatedTerminal {
    constructor(lines, options) {
        this.lines = lines;
        this.notificationText = 'Your private key was used: <br> <span style="">git pull github:hello.git</span>'; //ssh root@server</span>';
    }

    startAnimation () {
        this.animateLine (0);
    }

    animateLine (i) {
        let _l = new Line([this.lines[i][0],this.lines[i][1]], {showCursor: this.lines[i][2]});

        let animateNextLine = () => {
            if (i < this.lines.length - 1) {
                _l.hideCursor();

                if (i==0) {
                    this.showNotification(
                        this.notificationText,
                        () => {
                            this.animateLine(i+1)
                        });
                } else {
                    this.animateLine (i+1);
                }
            } else {
                this.animationComplete();
                // showNotification(notificationText, animationComplete);
            }
        }

        setTimeout (() => {
            _l.animate(animateNextLine, {shouldAnimate: this.lines[i][2]});
        }, (this.lines[i][3] ? this.lines[i][3] : 1000));
    }

    animationComplete () {
        setTimeout(() => {
            this.hideNotification(() => {});
            $('#terminal').html('');
            this.animateLine(0);
        }, 2000);
    }

    showNotification(text, cb){
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

    hideNotification(cb){
        $('#notification-card').animate({
            opacity: 0
        }, 100, 'easeInCubic', cb);
    };
}
