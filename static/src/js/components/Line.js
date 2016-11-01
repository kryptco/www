export class Line {
    // Terminal line consists of two parts for ex. '$' and 'ssh root'.
    // Array(2) line - ['$', 'ssh root']
    // Object Options:
    // Boolean showCursor - whether or not there should be a cursor the begining
    constructor(line, options) {
        this.id = this.uniqId();
        this.options = options;
        this.line = line;
        this.theater = theaterJS();

        this.init();
    }

    init() {
        this.createElement();
        this.appendToTerminal();
        this.prepareTheater();

        if (this.options.showCursor) {
            this.showCursor();
        }

        this.enableCursorBlink();
    }

    // Creates a jQuery element out of line parts
    createElement() {
        console.log(this.line);
        this.$line = $('<div></div>')
            .addClass('Hero-graphic__terminal__line');

        if (this.line[0] != '') {
            this.$line.append('<span class="pre">'+this.line[0]+'</span>');
        }

        this.$line
            .append('<div id="'+this.id+'" class="text"></div>')
            .append('<div class="cursor" style="display: none"></div>');
    }

    // Set options for animator
    prepareTheater() {
        this.theater.addActor(this.id, {accuracy: 1, speed: 1});
    }

    // Options:
    // Boolean shouldNotAnimate
    animate(cb, opt) {
        let options = {
            shouldAnimate: true
        }
        $.extend( true, options, opt );

        if (!this.line[1].length) {
            cb();
            return;
        }

        if (!options.shouldAnimate) {
            this.hideCursor();
            this.$line.find('.text').html(this.line[1]);
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
