const INProvider = class extends AbstractProvider {
    search() {
        $('.v1Nh3.kIKUG').not('.' + INIT_CLASS).each((a, b) => {
            const c = $(b),
                d = c.children('a').attr('href');
            d && !this.ids[d] && (this.addVideo(d), this.renderBtn(b, d)), c.addClass(INIT_CLASS)
        }), $('article video').not('.' + INIT_CLASS).each((a, b) => {
            const c = $(b),
                d = c.closest('article').find('a.c-Yi7').attr('href');
            d && !this.ids[d] && (this.addVideo(d), this.renderBtn($(b).closest('._97aPb'), d)), c.addClass(INIT_CLASS)
        })
    }

    getVideoData(a, b) {
        $.get(a, (c) => {
            const d = this.getVideoTitle(c),
                e = this.getVideoUrl(c),
                f = [];
            e && f.push({
                title: d,
                url: e,
                vid: a,
                provider: 'in',
                quality: '640p'
            }), b(f)
        })
    }

    getVideoTitle(a) {
        const b = a.match(/<title>([\s\S]+?)<\/title>/);
        return b && b[1] ? b[1] : ''
    }

    getVideoUrl(a) {
        const b = a.match(/<meta property="og:video"\s+content="(.+)"\s+\/>/);
        return b && b[1] ? b[1] : null
    }
};