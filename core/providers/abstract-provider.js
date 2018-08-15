const AbstractProvider = class {
    constructor() {
        this.ids = {}, this.videos = [], this.setBadge()
    }

    run() {
        setInterval(() => this.search(), 1e3)
    }

    search() {}

    addVideo(a) {
        this.ids[a] = !0, this.getVideoData(a, (a) => {
            this.videos = this.videos.concat(a), this.setBadge()
        })
    }

    getVideoData() {}

    setBadge() {
        chrome['runtime'].sendMessage({
            action: 'setBadge',
            value: this.videos.length
        })
    }

    updateVideoUrl(a, b, c) {
        this.getVideoData(a, (a) => {
            const d = a.find((a) => a.quality = b);
            c(d.url)
        })
    }

    renderBtn(a, b) {
        $(a).find('.mtz-download-btn').remove(), $(`<button class="mtz-download-btn" vid="${b}">${chrome.i18n.getMessage('download_btn')}</button>`).appendTo(a).on('click', (a) => {
            a.stopPropagation(), this.download(a.target)
        })
    }

    download(a) {
        const b = a.getAttribute('vid'),
            c = this.videos.find((a) => a.vid === b);
        chrome['runtime'].sendMessage({
            action: 'downloadVideo',
            video: c
        })
    }
};