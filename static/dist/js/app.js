(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _SomeComponent = require('./components/SomeComponent');

var _AnimatedGif = require('./components/AnimatedGif');

var _AnimatedTerminal = require('./components/AnimatedTerminal');

var _ActionSet = require('./data/ActionSet');

var started = false;

var initFn = function initFn() {
	if (started) {
		return;
	}
	started = true;
	$('#phoneGIF').attr('src', "https://s3.amazonaws.com/kryptco-assets/krypt-gif.gif");

	var actions = [{
		lines: [['$', 'ssh root@server', true], ['root:~#', '', true, 1000]],
		notificationText: 'Your private key was used: <br> <span style="">ssh root@server</span>',
		notificationIndex: 0,
		notificationDelay: 6000
	}, {
		lines: [['$', 'git pull origin master', true], ['', 'Updating c21fc5a..3b8a0a5', false, 10], ['', '7 files changed, done.', false], ['$', '', true, 4000]],
		notificationIndex: 0,
		notificationText: 'Your private key was used: <br> <span style="">git pull github:hello.git</span>',
		notificationDelay: 1000
	}];

	animateAction(0);

	function animateAction(i) {
		var a = actions[i];
		var animatedTerminal = new _AnimatedTerminal.AnimatedTerminal(a.lines, { notificationIndex: 0, notificationText: a.notificationText, notificationDelay: a.notificationDelay });
		animatedTerminal.startAnimation(function () {
			if (i == actions.length - 1) {
				$('#phoneGIF').attr('src', "https://s3.amazonaws.com/kryptco-assets/krypt-gif.gif");
			}
			i == actions.length - 1 ? animateAction(0) : animateAction(i + 1);
		});
	}
};

function formSuccess() {
	$("#betaForm").html("<p><strong>Thanks for signing up! Look out for an invite shortly.</strong></p>");
}

function formError() {}

function betaFormSubmit() {
	// Add the iframe with a unique name
	var iframe = document.createElement("iframe");
	var uniqueString = String(Math.random());
	document.body.appendChild(iframe);
	iframe.style.display = "none";
	iframe.contentWindow.name = uniqueString;

	// construct a form with hidden inputs, targeting the iframe
	var form = document.createElement("form");
	form.target = uniqueString;
	form.action = "https://docs.google.com/forms/d/e/1FAIpQLSed2U7xikAyQLujJuXO0K2Bgz3bTmVSrv7JyvsvfpEggT4gqg/formResponse";
	form.method = "POST";

	// repeat for each parameter
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "entry.1643900225";
	input.value = $("#betaFormEmail").val();
	form.appendChild(input);

	document.body.appendChild(form);
	form.submit();
	formSuccess();
}

$(document).ready(function () {
	$('#get-started-button').on('click', scrollToGetStartedSection);
	$('.FAQ__question').on('click', function () {
		$(this).toggleClass('open');
		$(this).find('.FAQ__question__answer').slideToggle(500, 'easeInOutQuad');
	});
	$("#betaFormSubmit").click(betaFormSubmit);
	$('#phoneGIF').attr('src', "https://s3.amazonaws.com/kryptco-assets/krypt-gif.gif");
	$("#phoneGIF").load(initFn);
	setTimeout(function () {
		initFn();
	}, 6000);
	$('#betaFormEmail').bind("enterKey", betaFormSubmit);
	$('#betaFormEmail').keyup(function (e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});
});

function scrollToGetStartedSection() {
	var offset = $('.Section--get-started').offset().top;

	$('html, body').animate({
		scrollTop: offset
	}, 1000, 'easeInOutQuart');
}

},{"./components/AnimatedGif":2,"./components/AnimatedTerminal":3,"./components/SomeComponent":5,"./data/ActionSet":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimatedGif = undefined;

var _libgif = require('../lib/libgif');

var AnimatedGif = exports.AnimatedGif = function AnimatedGif(cb) {
    var loadingGif = new _libgif.SuperGif({
        gif: $('.Hero-graphic__phone__loading')[0],
        show_progress_bar: false,
        loop_mode: true, //false,
        draw_while_loading: false,
        auto_play: true,
        on_end: function on_end() {
            if (cb) {
                cb();
            }
        }
    });

    loadingGif.load(function () {
        loadingGif.play();
    });
};

},{"../lib/libgif":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimatedTerminal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Line = require('./Line');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimatedTerminal = exports.AnimatedTerminal = function () {
    function AnimatedTerminal(lines, options) {
        _classCallCheck(this, AnimatedTerminal);

        this.lines = lines;
        this.notificationIndex = options.notificationIndex;
        this.notificationText = options.notificationText;
        this.notificationDelay = options.notificationDelay;
    }

    _createClass(AnimatedTerminal, [{
        key: 'startAnimation',
        value: function startAnimation(cb) {
            this.completionCallback = cb;
            this.animateLine(0);
        }
    }, {
        key: 'typeOutLine',
        value: function typeOutLine(a, cb) {
            var options = {
                showCursor: true,
                shouldTypeOut: true
            };

            $.extend(true, options, a);

            var _l = new _Line.Line(a.line);
            _l.animate(cb ? cb : {}, options);
        }
    }, {
        key: 'animateLine',
        value: function animateLine(i) {
            var _this = this;

            console.log(this.lines[i]);
            var _l = new _Line.Line([this.lines[i][0], this.lines[i][1]], { showCursor: this.lines[i][2] });

            var animateNextLine = function animateNextLine() {
                if (i < _this.lines.length - 1) {
                    _l.hideCursor();

                    if (i == _this.notificationIndex) {
                        _this.showNotification(_this.notificationText, function () {
                            _this.animateLine(i + 1);
                        }, _this.notificationDelay);
                    } else {
                        _this.animateLine(i + 1);
                    }
                } else {
                    _this.animationComplete();
                    // showNotification(notificationText, animationComplete);
                }
            };

            setTimeout(function () {
                _l.animate(animateNextLine, { shouldAnimate: _this.lines[i][2] });
            }, this.lines[i][3] ? this.lines[i][3] : 1000);
        }
    }, {
        key: 'animationComplete',
        value: function animationComplete() {
            var _this2 = this;

            console.log('animation complete');
            setTimeout(function () {
                _this2.hideNotification(function () {});
                $('#terminal').html('');
                _this2.completionCallback();
            }, 2000);
        }
    }, {
        key: 'showNotification',
        value: function showNotification(text, cb, delay) {
            $('#notification-card main').html(text);
            $('#notification-card').css({
                top: '20px'
            }).animate({
                opacity: 1,
                top: '0px'
            }, delay || 2000, 'easeOutCubic', function () {
                cb();
            });
        }
    }, {
        key: 'hideNotification',
        value: function hideNotification(cb) {
            $('#notification-card').animate({
                opacity: 0
            }, 100, 'easeInCubic', cb);
        }
    }]);

    return AnimatedTerminal;
}();

},{"./Line":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = exports.Line = function () {
    // Terminal line consists of two parts for ex. '$' and 'ssh root'.
    // Array(2) line - ['$', 'ssh root']
    // Object Options:
    // Boolean showCursor - whether or not there should be a cursor the begining
    function Line(line, options) {
        _classCallCheck(this, Line);

        this.id = this.uniqId();
        this.options = options;
        this.line = line;
        this.theater = theaterJS();

        this.init();
    }

    _createClass(Line, [{
        key: 'init',
        value: function init() {
            this.createElement();
            this.appendToTerminal();
            this.prepareTheater();

            if (this.options.showCursor) {
                this.showCursor();
            }

            this.enableCursorBlink();
        }

        // Creates a jQuery element out of line parts

    }, {
        key: 'createElement',
        value: function createElement() {
            console.log(this.line);
            this.$line = $('<div></div>').addClass('Hero-graphic__terminal__line');

            if (this.line[0] != '') {
                this.$line.append('<span class="pre">' + this.line[0] + '</span>');
            }

            this.$line.append('<div id="' + this.id + '" class="text"></div>').append('<div class="cursor" style="display: none"></div>');
        }

        // Set options for animator

    }, {
        key: 'prepareTheater',
        value: function prepareTheater() {
            this.theater.addActor(this.id, { accuracy: 1, speed: 1 });
        }

        // Options:
        // Boolean shouldNotAnimate

    }, {
        key: 'animate',
        value: function animate(cb, opt) {
            var _this = this;

            var options = {
                shouldAnimate: true
            };
            $.extend(true, options, opt);

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
            this.theater.addScene(this.id + ':' + this.line[1], 100).addScene(function () {
                _this.enableCursorBlink();
                cb();
            });
        }
    }, {
        key: 'appendToTerminal',
        value: function appendToTerminal() {
            var $terminal = $('#terminal');
            $terminal.append(this.$line);
        }
    }, {
        key: 'erase',
        value: function erase() {
            this.$line.find('.text').html('');
        }
    }, {
        key: 'enableCursorBlink',
        value: function enableCursorBlink() {
            this.$line.find('.cursor').addClass('blink');
        }
    }, {
        key: 'disableCursorBlink',
        value: function disableCursorBlink() {
            this.$line.find('.cursor').removeClass('blink');
        }
    }, {
        key: 'hideCursor',
        value: function hideCursor() {
            this.$line.find('.cursor').hide(0);
        }
    }, {
        key: 'showCursor',
        value: function showCursor() {
            this.$line.find('.cursor').show(0);
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$line.remove();
        }
    }, {
        key: 'uniqId',
        value: function uniqId() {
            return 'text' + Math.round(new Date().getTime() + Math.random() * 100);
        }
    }]);

    return Line;
}();

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SomeComponent = exports.SomeComponent = {};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var actionSet = [];

actionSet[0] = [{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', 'ssh root@server']
    }
}, {
    actor: 'Phone',
    action: {
        type: 'showNotification',
        notificationText: 'Your private key was used: <br> <span style="">ssh root@server</span>'
    }
}, {
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['root:~#', '']
    },
    delayAfterFinish: 4000
}];

actionSet[1] = [{
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', 'git pull origin master']
    }
}, {
    actor: 'Phone',
    action: {
        type: 'showNotification',
        notificationText: 'Your private key was used: <br> <span style="">git pull github:hello.git</span>'
    }
}, {
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['', 'Updating c21fc5a..3b8a0a5'],
        showCursor: false,
        shouldTypeOut: false
    },
    delayAfterFinish: 10
}, {
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['', '7 files changed, done.'],
        showCursor: false,
        shouldTypeOut: false
    }
}, {
    actor: 'Terminal',
    action: {
        type: 'typeOutLine',
        line: ['$', '']
    },
    delayAfterFinish: 4000
}];

exports.actionSet = actionSet;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    SuperGif

    Example usage:

        <img src="./example1_preview.gif" rel:animated_src="./example1.gif" width="360" height="360" rel:auto_play="1" />

        <script type="text/javascript">
            $$('img').each(function (img_tag) {
                if (/.*\.gif/.test(img_tag.src)) {
                    var rub = new SuperGif({ gif: img_tag } );
                    rub.load();
                }
            });
        </script>

    Image tag attributes:

        rel:animated_src -  If this url is specified, it's loaded into the player instead of src.
                            This allows a preview frame to be shown until animated gif data is streamed into the canvas

        rel:auto_play -     Defaults to 1 if not specified. If set to zero, a call to the play() method is needed

    Constructor options args

        gif                 Required. The DOM element of an img tag.
        loop_mode           Optional. Setting this to false will force disable looping of the gif.
        auto_play           Optional. Same as the rel:auto_play attribute above, this arg overrides the img tag info.
        max_width           Optional. Scale images over max_width down to max_width. Helpful with mobile.
        on_end              Optional. Add a callback for when the gif reaches the end of a single loop (one iteration). The first argument passed will be the gif HTMLElement.
        loop_delay          Optional. The amount of time to pause (in ms) after each single loop (iteration).
        draw_while_loading  Optional. Determines whether the gif will be drawn to the canvas whilst it is loaded.
        show_progress_bar   Optional. Only applies when draw_while_loading is set to true.

    Instance methods

        // loading
        load( callback )        Loads the gif specified by the src or rel:animated_src sttributie of the img tag into a canvas element and then calls callback if one is passed
        load_url( src, callback )   Loads the gif file specified in the src argument into a canvas element and then calls callback if one is passed

        // play controls
        play -              Start playing the gif
        pause -             Stop playing the gif
        move_to(i) -        Move to frame i of the gif
        move_relative(i) -  Move i frames ahead (or behind if i < 0)

        // getters
        get_canvas          The canvas element that the gif is playing in. Handy for assigning event handlers to.
        get_playing         Whether or not the gif is currently playing
        get_loading         Whether or not the gif has finished loading/parsing
        get_auto_play       Whether or not the gif is set to play automatically
        get_length          The number of frames in the gif
        get_current_frame   The index of the currently displayed frame of the gif

        For additional customization (viewport inside iframe) these params may be passed:
        c_w, c_h - width and height of canvas
        vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport

        A bonus: few articles to understand what is going on
            http://enthusiasms.org/post/16976438906
            http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
            http://humpy77.deviantart.com/journal/Frame-Delay-Times-for-Animated-GIFs-214150546

*/
var SuperGif = exports.SuperGif = factory();

function factory() {
    // Generic functions
    var bitsToNum = function bitsToNum(ba) {
        return ba.reduce(function (s, n) {
            return s * 2 + n;
        }, 0);
    };

    var byteToBitArr = function byteToBitArr(bite) {
        var a = [];
        for (var i = 7; i >= 0; i--) {
            a.push(!!(bite & 1 << i));
        }
        return a;
    };

    // Stream
    /**
     * @constructor
     */
    // Make compiler happy.
    var Stream = function Stream(data) {
        this.data = data;
        this.len = this.data.length;
        this.pos = 0;

        this.readByte = function () {
            if (this.pos >= this.data.length) {
                throw new Error('Attempted to read past end of stream.');
            }
            if (data instanceof Uint8Array) return data[this.pos++];else return data.charCodeAt(this.pos++) & 0xFF;
        };

        this.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(this.readByte());
            }
            return bytes;
        };

        this.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(this.readByte());
            }
            return s;
        };

        this.readUnsigned = function () {
            // Little-endian.
            var a = this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
    };

    var lzwDecode = function lzwDecode(minCodeSize, data) {
        // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
        var pos = 0; // Maybe this streaming thing should be merged with the Stream?
        var readCode = function readCode(size) {
            var code = 0;
            for (var i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & 1 << (pos & 7)) {
                    code |= 1 << i;
                }
                pos++;
            }
            return code;
        };

        var output = [];

        var clearCode = 1 << minCodeSize;
        var eoiCode = clearCode + 1;

        var codeSize = minCodeSize + 1;

        var dict = [];

        var clear = function clear() {
            dict = [];
            codeSize = minCodeSize + 1;
            for (var i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;
        };

        var code;
        var last;

        while (true) {
            last = code;
            code = readCode(codeSize);

            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) break;

            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            } else {
                if (code !== dict.length) throw new Error('Invalid LZW code.');
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);

            if (dict.length === 1 << codeSize && codeSize < 12) {
                // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
                codeSize++;
            }
        }

        // I don't know if this is technically an error, but some GIFs do it.
        //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
        return output;
    };

    // The actual parsing; returns an object with properties.
    var parseGIF = function parseGIF(st, handler) {
        handler || (handler = {});

        // LZW (GIF-specific)
        var parseCT = function parseCT(entries) {
            // Each entry is 3 bytes, for RGB.
            var ct = [];
            for (var i = 0; i < entries; i++) {
                ct.push(st.readBytes(3));
            }
            return ct;
        };

        var readSubBlocks = function readSubBlocks() {
            var size, data;
            data = '';
            do {
                size = st.readByte();
                data += st.read(size);
            } while (size !== 0);
            return data;
        };

        var parseHeader = function parseHeader() {
            var hdr = {};
            hdr.sig = st.read(3);
            hdr.ver = st.read(3);
            if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
            hdr.width = st.readUnsigned();
            hdr.height = st.readUnsigned();

            var bits = byteToBitArr(st.readByte());
            hdr.gctFlag = bits.shift();
            hdr.colorRes = bitsToNum(bits.splice(0, 3));
            hdr.sorted = bits.shift();
            hdr.gctSize = bitsToNum(bits.splice(0, 3));

            hdr.bgColor = st.readByte();
            hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            if (hdr.gctFlag) {
                hdr.gct = parseCT(1 << hdr.gctSize + 1);
            }
            handler.hdr && handler.hdr(hdr);
        };

        var parseExt = function parseExt(block) {
            var parseGCExt = function parseGCExt(block) {
                var blockSize = st.readByte(); // Always 4
                var bits = byteToBitArr(st.readByte());
                block.reserved = bits.splice(0, 3); // Reserved; should be 000.
                block.disposalMethod = bitsToNum(bits.splice(0, 3));
                block.userInput = bits.shift();
                block.transparencyGiven = bits.shift();

                block.delayTime = st.readUnsigned();

                block.transparencyIndex = st.readByte();

                block.terminator = st.readByte();

                handler.gce && handler.gce(block);
            };

            var parseComExt = function parseComExt(block) {
                block.comment = readSubBlocks();
                handler.com && handler.com(block);
            };

            var parsePTExt = function parsePTExt(block) {
                // No one *ever* uses this. If you use it, deal with parsing it yourself.
                var blockSize = st.readByte(); // Always 12
                block.ptHeader = st.readBytes(12);
                block.ptData = readSubBlocks();
                handler.pte && handler.pte(block);
            };

            var parseAppExt = function parseAppExt(block) {
                var parseNetscapeExt = function parseNetscapeExt(block) {
                    var blockSize = st.readByte(); // Always 3
                    block.unknown = st.readByte(); // ??? Always 1? What is this?
                    block.iterations = st.readUnsigned();
                    block.terminator = st.readByte();
                    handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
                };

                var parseUnknownAppExt = function parseUnknownAppExt(block) {
                    block.appData = readSubBlocks();
                    // FIXME: This won't work if a handler wants to match on any identifier.
                    handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
                };

                var blockSize = st.readByte(); // Always 11
                block.identifier = st.read(8);
                block.authCode = st.read(3);
                switch (block.identifier) {
                    case 'NETSCAPE':
                        parseNetscapeExt(block);
                        break;
                    default:
                        parseUnknownAppExt(block);
                        break;
                }
            };

            var parseUnknownExt = function parseUnknownExt(block) {
                block.data = readSubBlocks();
                handler.unknown && handler.unknown(block);
            };

            block.label = st.readByte();
            switch (block.label) {
                case 0xF9:
                    block.extType = 'gce';
                    parseGCExt(block);
                    break;
                case 0xFE:
                    block.extType = 'com';
                    parseComExt(block);
                    break;
                case 0x01:
                    block.extType = 'pte';
                    parsePTExt(block);
                    break;
                case 0xFF:
                    block.extType = 'app';
                    parseAppExt(block);
                    break;
                default:
                    block.extType = 'unknown';
                    parseUnknownExt(block);
                    break;
            }
        };

        var parseImg = function parseImg(img) {
            var deinterlace = function deinterlace(pixels, width) {
                // Of course this defeats the purpose of interlacing. And it's *probably*
                // the least efficient way it's ever been implemented. But nevertheless...
                var newPixels = new Array(pixels.length);
                var rows = pixels.length / width;
                var cpRow = function cpRow(toRow, fromRow) {
                    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
                };

                // See appendix E.
                var offsets = [0, 4, 2, 1];
                var steps = [8, 8, 4, 2];

                var fromRow = 0;
                for (var pass = 0; pass < 4; pass++) {
                    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                        cpRow(toRow, fromRow);
                        fromRow++;
                    }
                }

                return newPixels;
            };

            img.leftPos = st.readUnsigned();
            img.topPos = st.readUnsigned();
            img.width = st.readUnsigned();
            img.height = st.readUnsigned();

            var bits = byteToBitArr(st.readByte());
            img.lctFlag = bits.shift();
            img.interlaced = bits.shift();
            img.sorted = bits.shift();
            img.reserved = bits.splice(0, 2);
            img.lctSize = bitsToNum(bits.splice(0, 3));

            if (img.lctFlag) {
                img.lct = parseCT(1 << img.lctSize + 1);
            }

            img.lzwMinCodeSize = st.readByte();

            var lzwData = readSubBlocks();

            img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

            if (img.interlaced) {
                // Move
                img.pixels = deinterlace(img.pixels, img.width);
            }

            handler.img && handler.img(img);
        };

        var parseBlock = function parseBlock() {
            var block = {};
            block.sentinel = st.readByte();

            switch (String.fromCharCode(block.sentinel)) {// For ease of matching
                case '!':
                    block.type = 'ext';
                    parseExt(block);
                    break;
                case ',':
                    block.type = 'img';
                    parseImg(block);
                    break;
                case ';':
                    block.type = 'eof';
                    handler.eof && handler.eof(block);
                    break;
                default:
                    throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
            }

            if (block.type !== 'eof') setTimeout(parseBlock, 0);
        };

        var parse = function parse() {
            parseHeader();
            setTimeout(parseBlock, 0);
        };

        parse();
    };

    var SuperGif = function SuperGif(opts) {
        var options = {
            //viewport position
            vp_l: 0,
            vp_t: 0,
            vp_w: null,
            vp_h: null,
            //canvas sizes
            c_w: null,
            c_h: null
        };
        for (var i in opts) {
            options[i] = opts[i];
        }
        if (options.vp_w && options.vp_h) options.is_vp = true;

        var stream;
        var hdr;

        var loadError = null;
        var loading = false;

        var transparency = null;
        var delay = null;
        var disposalMethod = null;
        var disposalRestoreFromIdx = null;
        var lastDisposalMethod = null;
        var frame = null;
        var lastImg = null;

        var playing = true;
        var forward = true;

        var ctx_scaled = false;

        var frames = [];
        var frameOffsets = []; // elements have .x and .y properties

        var gif = options.gif;
        if (typeof options.auto_play == 'undefined') options.auto_play = !gif.getAttribute('rel:auto_play') || gif.getAttribute('rel:auto_play') == '1';

        var onEndListener = options.hasOwnProperty('on_end') ? options.on_end : null;
        var loopDelay = options.hasOwnProperty('loop_delay') ? options.loop_delay : 0;
        var overrideLoopMode = options.hasOwnProperty('loop_mode') ? options.loop_mode : 'auto';
        var drawWhileLoading = options.hasOwnProperty('draw_while_loading') ? options.draw_while_loading : true;
        var showProgressBar = drawWhileLoading ? options.hasOwnProperty('show_progress_bar') ? options.show_progress_bar : true : false;
        var progressBarHeight = options.hasOwnProperty('progressbar_height') ? options.progressbar_height : 25;
        var progressBarBackgroundColor = options.hasOwnProperty('progressbar_background_color') ? options.progressbar_background_color : 'rgba(255,255,255,0.4)';
        var progressBarForegroundColor = options.hasOwnProperty('progressbar_foreground_color') ? options.progressbar_foreground_color : 'rgba(255,0,22,.8)';

        var clear = function clear() {
            transparency = null;
            delay = null;
            lastDisposalMethod = disposalMethod;
            disposalMethod = null;
            frame = null;
        };

        // XXX: There's probably a better way to handle catching exceptions when
        // callbacks are involved.
        var doParse = function doParse() {
            try {
                parseGIF(stream, handler);
            } catch (err) {
                doLoadError('parse');
            }
        };

        var doText = function doText(text) {
            toolbar.innerHTML = text; // innerText? Escaping? Whatever.
            toolbar.style.visibility = 'visible';
        };

        var setSizes = function setSizes(w, h) {
            canvas.width = w * _get_canvas_scale();
            canvas.height = h * _get_canvas_scale();
            toolbar.style.minWidth = w * _get_canvas_scale() + 'px';

            tmpCanvas.width = w;
            tmpCanvas.height = h;
            tmpCanvas.style.width = w + 'px';
            tmpCanvas.style.height = h + 'px';
            tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        };

        var setFrameOffset = function setFrameOffset(frame, offset) {
            if (!frameOffsets[frame]) {
                frameOffsets[frame] = offset;
                return;
            }
            if (typeof offset.x !== 'undefined') {
                frameOffsets[frame].x = offset.x;
            }
            if (typeof offset.y !== 'undefined') {
                frameOffsets[frame].y = offset.y;
            }
        };

        var doShowProgress = function doShowProgress(pos, length, draw) {
            if (draw && showProgressBar) {
                var height = progressBarHeight;
                var left, mid, top, width;
                if (options.is_vp) {
                    if (!ctx_scaled) {
                        top = options.vp_t + options.vp_h - height;
                        height = height;
                        left = options.vp_l;
                        mid = left + pos / length * options.vp_w;
                        width = canvas.width;
                    } else {
                        top = (options.vp_t + options.vp_h - height) / _get_canvas_scale();
                        height = height / _get_canvas_scale();
                        left = options.vp_l / _get_canvas_scale();
                        mid = left + pos / length * (options.vp_w / _get_canvas_scale());
                        width = canvas.width / _get_canvas_scale();
                    }
                    //some debugging, draw rect around viewport
                    if (false) {
                        if (!ctx_scaled) {
                            var l = options.vp_l,
                                t = options.vp_t;
                            var w = options.vp_w,
                                h = options.vp_h;
                        } else {
                            var l = options.vp_l / _get_canvas_scale(),
                                t = options.vp_t / _get_canvas_scale();
                            var w = options.vp_w / _get_canvas_scale(),
                                h = options.vp_h / _get_canvas_scale();
                        }
                        ctx.rect(l, t, w, h);
                        ctx.stroke();
                    }
                } else {
                    top = (canvas.height - height) / (ctx_scaled ? _get_canvas_scale() : 1);
                    mid = pos / length * canvas.width / (ctx_scaled ? _get_canvas_scale() : 1);
                    width = canvas.width / (ctx_scaled ? _get_canvas_scale() : 1);
                    height /= ctx_scaled ? _get_canvas_scale() : 1;
                }

                ctx.fillStyle = progressBarBackgroundColor;
                ctx.fillRect(mid, top, width - mid, height);

                ctx.fillStyle = progressBarForegroundColor;
                ctx.fillRect(0, top, mid, height);
            }
        };

        var doLoadError = function doLoadError(originOfError) {
            var drawError = function drawError() {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.moveTo(0, 0);
                ctx.lineTo(options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
                ctx.moveTo(0, options.c_h ? options.c_h : hdr.height);
                ctx.lineTo(options.c_w ? options.c_w : hdr.width, 0);
                ctx.stroke();
            };

            loadError = originOfError;
            hdr = {
                width: gif.width,
                height: gif.height
            }; // Fake header.
            frames = [];
            drawError();
        };

        var doHdr = function doHdr(_hdr) {
            hdr = _hdr;
            setSizes(hdr.width, hdr.height);
        };

        var doGCE = function doGCE(gce) {
            pushFrame();
            clear();
            transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
            delay = gce.delayTime;
            disposalMethod = gce.disposalMethod;
            // We don't have much to do with the rest of GCE.
        };

        var pushFrame = function pushFrame() {
            if (!frame) return;
            frames.push({
                data: frame.getImageData(0, 0, hdr.width, hdr.height),
                delay: delay
            });
            frameOffsets.push({ x: 0, y: 0 });
        };

        var doImg = function doImg(img) {
            if (!frame) frame = tmpCanvas.getContext('2d');

            var currIdx = frames.length;

            //ct = color table, gct = global color table
            var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

            /*
            Disposal method indicates the way in which the graphic is to
            be treated after being displayed.
             Values :    0 - No disposal specified. The decoder is
                            not required to take any action.
                        1 - Do not dispose. The graphic is to be left
                            in place.
                        2 - Restore to background color. The area used by the
                            graphic must be restored to the background color.
                        3 - Restore to previous. The decoder is required to
                            restore the area overwritten by the graphic with
                            what was there prior to rendering the graphic.
                             Importantly, "previous" means the frame state
                            after the last disposal of method 0, 1, or 2.
            */
            if (currIdx > 0) {
                if (lastDisposalMethod === 3) {
                    // Restore to previous
                    // If we disposed every frame including first frame up to this point, then we have
                    // no composited frame to restore to. In this case, restore to background instead.
                    if (disposalRestoreFromIdx !== null) {
                        frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
                    } else {
                        frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                    }
                } else {
                    disposalRestoreFromIdx = currIdx - 1;
                }

                if (lastDisposalMethod === 2) {
                    // Restore to background color
                    // Browser implementations historically restore to transparent; we do the same.
                    // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                    frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                }
            }
            // else, Undefined/Do not dispose.
            // frame contains final pixel data from the last frame; do nothing

            //Get existing pixels for img region after applying disposal method
            var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);

            //apply color table colors
            img.pixels.forEach(function (pixel, i) {
                // imgData.data === [R,G,B,A,R,G,B,A,...]
                if (pixel !== transparency) {
                    imgData.data[i * 4 + 0] = ct[pixel][0];
                    imgData.data[i * 4 + 1] = ct[pixel][1];
                    imgData.data[i * 4 + 2] = ct[pixel][2];
                    imgData.data[i * 4 + 3] = 255; // Opaque.
                }
            });

            frame.putImageData(imgData, img.leftPos, img.topPos);

            if (!ctx_scaled) {
                ctx.scale(_get_canvas_scale(), _get_canvas_scale());
                ctx_scaled = true;
            }

            // We could use the on-page canvas directly, except that we draw a progress
            // bar for each image chunk (not just the final image).
            if (drawWhileLoading) {
                ctx.drawImage(tmpCanvas, 0, 0);
                drawWhileLoading = options.auto_play;
            }

            lastImg = img;
        };

        var player = function () {
            var i = -1;
            var iterationCount = 0;

            var showingInfo = false;
            var pinned = false;

            /**
             * Gets the index of the frame "up next".
             * @returns {number}
             */
            var getNextFrameNo = function getNextFrameNo() {
                var delta = forward ? 1 : -1;
                return (i + delta + frames.length) % frames.length;
            };

            var stepFrame = function stepFrame(amount) {
                // XXX: Name is confusing.
                i = i + amount;

                putFrame();
            };

            var step = function () {
                var stepping = false;

                var completeLoop = function completeLoop() {
                    if (onEndListener !== null) onEndListener(gif);
                    iterationCount++;

                    if (overrideLoopMode !== false || iterationCount < 0) {
                        doStep();
                    } else {
                        stepping = false;
                        playing = false;
                    }
                };

                var doStep = function doStep() {
                    stepping = playing;
                    if (!stepping) return;

                    stepFrame(1);
                    var delay = frames[i].delay * 10;
                    if (!delay) delay = 100; // FIXME: Should this even default at all? What should it be?

                    var nextFrameNo = getNextFrameNo();
                    if (nextFrameNo === 0) {
                        delay += loopDelay;
                        setTimeout(completeLoop, delay);
                    } else {
                        setTimeout(doStep, delay);
                    }
                };

                return function () {
                    if (!stepping) setTimeout(doStep, 0);
                };
            }();

            var putFrame = function putFrame() {
                var offset;
                i = parseInt(i, 10);

                if (i > frames.length - 1) {
                    i = 0;
                }

                if (i < 0) {
                    i = 0;
                }

                offset = frameOffsets[i];

                tmpCanvas.getContext("2d").putImageData(frames[i].data, offset.x, offset.y);
                ctx.globalCompositeOperation = "copy";
                ctx.drawImage(tmpCanvas, 0, 0);
            };

            var play = function play() {
                playing = true;
                step();
            };

            var pause = function pause() {
                playing = false;
            };

            return {
                init: function init() {
                    if (loadError) return;

                    if (!(options.c_w && options.c_h)) {
                        ctx.scale(_get_canvas_scale(), _get_canvas_scale());
                    }

                    if (options.auto_play) {
                        step();
                    } else {
                        i = 0;
                        putFrame();
                    }
                },
                step: step,
                play: play,
                pause: pause,
                playing: playing,
                move_relative: stepFrame,
                current_frame: function current_frame() {
                    return i;
                },
                length: function length() {
                    return frames.length;
                },
                move_to: function move_to(frame_idx) {
                    i = frame_idx;
                    putFrame();
                }
            };
        }();

        var doDecodeProgress = function doDecodeProgress(draw) {
            doShowProgress(stream.pos, stream.data.length, draw);
        };

        var doNothing = function doNothing() {};
        /**
         * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
         *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
         *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
         */
        var withProgress = function withProgress(fn, draw) {
            return function (block) {
                fn(block);
                doDecodeProgress(draw);
            };
        };

        var handler = {
            hdr: withProgress(doHdr),
            gce: withProgress(doGCE),
            com: withProgress(doNothing),
            // I guess that's all for now.
            app: {
                // TODO: Is there much point in actually supporting iterations?
                NETSCAPE: withProgress(doNothing)
            },
            img: withProgress(doImg, true),
            eof: function eof(block) {
                //toolbar.style.display = '';
                pushFrame();
                doDecodeProgress(false);
                if (!(options.c_w && options.c_h)) {
                    canvas.width = hdr.width * _get_canvas_scale();
                    canvas.height = hdr.height * _get_canvas_scale();
                }
                player.init();
                loading = false;
                if (load_callback) {
                    load_callback(gif);
                }
            }
        };

        var init = function init() {
            var parent = gif.parentNode;

            var div = document.createElement('div');
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            toolbar = document.createElement('div');

            tmpCanvas = document.createElement('canvas');

            div.width = canvas.width = gif.width;
            div.height = canvas.height = gif.height;
            toolbar.style.minWidth = gif.width + 'px';

            div.className = 'jsgif';
            toolbar.className = 'jsgif_toolbar';
            div.appendChild(canvas);
            div.appendChild(toolbar);

            parent.insertBefore(div, gif);
            parent.removeChild(gif);

            if (options.c_w && options.c_h) setSizes(options.c_w, options.c_h);
            initialized = true;
        };

        var _get_canvas_scale = function _get_canvas_scale() {
            var scale;
            if (options.max_width && hdr && hdr.width > options.max_width) {
                scale = options.max_width / hdr.width;
            } else {
                scale = 1;
            }
            return scale;
        };

        var canvas, ctx, toolbar, tmpCanvas;
        var initialized = false;
        var load_callback = false;

        var load_setup = function load_setup(callback) {
            if (loading) return false;
            if (callback) load_callback = callback;else load_callback = false;

            loading = true;
            frames = [];
            clear();
            disposalRestoreFromIdx = null;
            lastDisposalMethod = null;
            frame = null;
            lastImg = null;

            return true;
        };

        return {
            // play controls
            play: player.play,
            pause: player.pause,
            move_relative: player.move_relative,
            move_to: player.move_to,

            // getters for instance vars
            get_playing: function get_playing() {
                return player.playing;
            },
            get_canvas: function get_canvas() {
                return canvas;
            },
            get_canvas_scale: function get_canvas_scale() {
                return _get_canvas_scale();
            },
            get_loading: function get_loading() {
                return loading;
            },
            get_auto_play: function get_auto_play() {
                return options.auto_play;
            },
            get_length: function get_length() {
                return player.length();
            },
            get_current_frame: function get_current_frame() {
                return player.current_frame();
            },
            load_url: function load_url(src, callback) {
                if (!load_setup(callback)) return;

                var h = new XMLHttpRequest();
                // new browsers (XMLHttpRequest2-compliant)
                h.open('GET', src, true);

                if ('overrideMimeType' in h) {
                    h.overrideMimeType('text/plain; charset=x-user-defined');
                }

                // old browsers (XMLHttpRequest-compliant)
                else if ('responseType' in h) {
                        h.responseType = 'arraybuffer';
                    }

                    // IE9 (Microsoft.XMLHTTP-compliant)
                    else {
                            h.setRequestHeader('Accept-Charset', 'x-user-defined');
                        }

                h.onloadstart = function () {
                    // Wait until connection is opened to replace the gif element with a canvas to avoid a blank img
                    if (!initialized) init();
                };
                h.onload = function (e) {
                    if (this.status != 200) {
                        doLoadError('xhr - response');
                    }
                    // emulating response field for IE9
                    if (!('response' in this)) {
                        this.response = new VBArray(this.responseText).toArray().map(String.fromCharCode).join('');
                    }
                    var data = this.response;
                    if (data.toString().indexOf("ArrayBuffer") > 0) {
                        data = new Uint8Array(data);
                    }

                    stream = new Stream(data);
                    setTimeout(doParse, 0);
                };
                h.onprogress = function (e) {
                    if (e.lengthComputable) doShowProgress(e.loaded, e.total, true);
                };
                h.onerror = function () {
                    doLoadError('xhr');
                };
                h.send();
            },
            load: function load(callback) {
                this.load_url(gif.getAttribute('rel:animated_src') || gif.src, callback);
            },
            load_raw: function load_raw(arr, callback) {
                if (!load_setup(callback)) return;
                if (!initialized) init();
                stream = new Stream(arr);
                setTimeout(doParse, 0);
            },
            set_frame_offset: setFrameOffset
        };
    };

    return SuperGif;
};

},{}]},{},[1]);
