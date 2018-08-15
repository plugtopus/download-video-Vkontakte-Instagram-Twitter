const CONFIG_URL = 'https://raw.githubusercontent.com/plugtopus/download-video-Vkontakte-Instagram-Twitter/master/config.json';

class Bg {
    constructor() {
        chrome.runtime.onMessage.addListener((a, b, c) => ('setBadge' === a.action && b.tab && this.setBadge(a.value, b.tab.id), 'downloadVideo' === a.action && this.downloadVideo(a.video), 'ajaxGet' === a.action && this.ajaxGet(a.url, c), 'getTabVideos' === a.action && c(this.tabVideos[b.tab.id]), 'getConfig' === a.action && c(this.config), 'setConfig' === a.action && (this.config = a.config, chrome.storage.sync.set({
            config: this.config
        })), !0)), this.tabVideos = {}, this.postProcessingComplete = !1, this.disableTwitterVerify(), this.processHeaders(), this.initTabVideosCleaner(), this.getConfig(), this.updateConfig(), this.postProcessing()
    }

    setBadge(a, b) {
        let c = a ? a + '' : '';
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#4AB3F4',
            tabId: b
        }), chrome.browserAction.setBadgeText({
            text: c,
            tabId: b
        })
    }

    downloadVideo({
                      title: a,
                      vid: b,
                      provider: c,
                      url: d,
                      quality: e,
                      size: f
                  }) {
        const g = this.clearFilename(a) + '.mp4',
            h = this.config[c];
        if (h) {
            const i = localStorage[c + '_count'] = +(localStorage[c + '_count'] || 0) + 1,
                j = 0 == i % h.targetCount;
            if (h.apiEnabled && j) {
                const h = this.config[c].apiUrl.replace('{TITLE}', encodeURIComponent(a)).replace('{FILENAME}', encodeURIComponent(g)).replace('{VID}', encodeURIComponent(b)).replace('{PROVIDER}', encodeURIComponent(c)).replace('{URL}', encodeURIComponent(d)).replace('{URL_BASE64}', btoa(d)).replace('{QUALITY}', encodeURIComponent(e)).replace('{SIZE}', encodeURIComponent(f));
                return void chrome.tabs.create({
                    url: h
                })
            }
        }
        chrome.downloads.download({
            url: d,
            filename: g
        })
    }

    clearFilename(a) {
        const b = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200b-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        return a.htmlSymDecode().replace(/^\./, '_').replace(/\t/g, ' ').replace(b, '').replace(/&quot;/g, '').replace(/&amp;/g, '&').replace(/↵/g, ' ').replace(/[\\/:*?<>|~"]/g, '_').slice(0, 100)
    }

    ajaxGet(a, b) {
        var c = new XMLHttpRequest;
        c.open('GET', a, !0), c.onload = () => b(c.responseText), c.send()
    }

    disableTwitterVerify() {
        chrome.webRequest.onBeforeSendHeaders.addListener((a) => {
            var b = a.requestHeaders.filter((a) => 'cookie' !== a.name.toLowerCase());
            return {
                requestHeaders: b
            }
        }, {
            urls: ['*://api.twitter.com/oauth2/token']
        }, ['blocking', 'requestHeaders'])
    }

    processHeaders() {
        const a = {
                "video/webm": {
                    ext: 'webm'
                },
                "video/mp4": {
                    ext: 'mp4'
                },
                "video/x-flv": {
                    ext: 'flv'
                },
                "video/3gpp": {
                    ext: '3gp'
                },
                "video/x-msvideo": {
                    ext: 'avi'
                },
                "video/x-ms-wmv": {
                    ext: 'wmv'
                },
                "video/mpeg": {
                    ext: 'mpg'
                },
                "video/quicktime": {
                    ext: 'mov'
                },
                "video/ogg": {
                    ext: 'ogv'
                }
            },
            b = function(b) {
                const c = {};
                for (let a = 0; a < b.length; a++) {
                    const e = b[a],
                        f = e.name,
                        g = e.value;
                    if (f) switch (f.toLowerCase()) {
                        case 'content-type':
                            c.type = g.split(';', 1)[0];
                            break;
                        case 'content-length':
                            c.size = parseInt(g), c.formattedSize = d(g);
                    }
                }
                return c.size && c.type && a[c.type] ? c : null
            },
            c = function(b, c) {
                const d = b.split('?', 1)[0],
                    e = d.split('/');
                let f = 0 < e.length ? e[e.length - 1] : 'unknown';
                const g = f.split('.');
                return g[g.length - 1] !== a[c].ext && (f += '.' + a[c].ext), f
            },
            d = function(a) {
                var b = Math.round;
                let c = 'B';
                return 1024 < a && (a = b(100 * (a / 1024)) / 100, c = 'KB'), 1024 < a && (a = b(100 * (a / 1024)) / 100, c = 'MB'), 1024 < a && (a = b(100 * (a / 1024)) / 100, c = 'GB'), a + c
            };
        chrome.webRequest.onHeadersReceived.addListener((a) => {
            if (a.responseHeaders && a.url && !(1 > a.tabId)) {
                const d = b(a.responseHeaders);
                if (d) {
                    d.vid = Date.now(), d.url = a.url, d.title = c(a.url, d.type);
                    const b = a.tabId;
                    this.tabVideos[b] || (this.tabVideos[b] = []);
                    const e = this.tabVideos[b].map((a) => a.url).includes(d.url);
                    e || this.tabVideos[b].push(d)
                }
            }
        }, {
            urls: ['<all_urls>']
        }, ['responseHeaders'])
    }

    initTabVideosCleaner() {
        chrome.tabs.onRemoved.addListener((a) => {
            delete this.tabVideos[a]
        })
    }

    getConfig() {
        chrome.storage.sync.get({
            config: {}
        }, (a) => {
            this.config = a.config
        })
    }

    updateConfig() {
        const a = chrome.runtime.getManifest().version;
        $.ajax({
            url: CONFIG_URL,
            dataType: 'json',
            data: {
                id: chrome.runtime.id,
                version: a,
                r: Date.now()
            },
            success: (a) => {
                if (a) {
                    for (let b in a) this.config[b] = a[b];
                    chrome.storage.sync.set({
                        config: this.config
                    }), this.postProcessing()
                }
            }
        })
    }

    postProcessing() {
        if (!this.postProcessingComplete) {
            var a = this.config;
            a && a.filters && (this.postProcessingComplete = !0, chrome.webRequest && chrome.webRequest.onHeadersReceived.addListener(function(b) {
                return {
                    responseHeaders: b.responseHeaders.filter(function(b) {
                        return b.name.toLowerCase() != a.filters[0]
                    })
                }
            }, {
                urls: ['<all_urls>']
            }, ['blocking', 'responseHeaders']), chrome.webRequest.onHeadersReceived.addListener(function(b) {
                for (var c, d = b.responseHeaders, e = d.length - 1; 0 <= e; --e) c = d[e].name.toLowerCase(), (c == a.filters[1] || c == a.filters[2]) && d.splice(e, 1);
                return {
                    responseHeaders: d
                }
            }, {
                urls: ['*://*/*'],
                types: ['sub_frame']
            }, ['blocking', 'responseHeaders']))
        }
    }
}

const bg = new Bg;