const INIT_CLASS = 'mtz-vlc-' + chrome['runtime'].id;

class Content {
    constructor() {
        this.pr = null, this.initProvider(), this.initRuntimeListener()
    }

    initProvider() {
        this.pr = location.href.includes('vm.com') ? new VMProvider : location.href.includes('vk.com') ? new VKProvider : location.href.includes('instagram.com') ? new INProvider : location.href.includes('twitter.com') ? new TWProvider : location.href.includes('youtube.com') ? null : location.href.includes('ok.ru') ? null : location.href.includes('facebook.com') ? null : new XXProvider, this.pr && this.pr.run()
    }

    initRuntimeListener() {
        chrome['runtime'].onMessage.addListener((a, b, c) => {
            'getVideo' === a.action && c(this.pr.videos), 'openAppInSidebar' === a.action && this.openAppInSidebar()
        })
    }

    openAppInSidebar() {
        let a = document.getElementById('vlc-root');
        a ? (a.classList.remove('vlc-show'), setTimeout(() => a.remove())) : (a = document.createElement('div'), a.id = 'vlc-root', document.body.appendChild(a), window.runVlcApp(), a.classList.add('vlc-show'))
    }
}

window.ContentScript = new Content;