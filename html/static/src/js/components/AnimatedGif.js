import {SuperGif} from '../lib/libgif';

export let AnimatedGif = function(cb) {
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
