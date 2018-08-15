const TWProvider = class extends AbstractProvider {
    constructor() {
        super(), this.oauth2_access_token = null, this.getAccessToken()
    }

    getAccessToken(a) {
        const b = this;
        $.ajax({
            type: 'POST',
            url: TWProvider.OAUTH2_TOKEN_API_URL,
            headers: {
                Authorization: 'Basic ' + TWProvider.ENCODED_TOKEN_CREDENTIAL,
                "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                grant_type: 'client_credentials'
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: !1
            },
            success: (c) => {
                b.oauth2_access_token = c.access_token, a && a()
            }
        })
    }

    search() {
        this.oauth2_access_token && $('video').not('#vlc-video').not('.' + INIT_CLASS).each((a, b) => {
            const c = $(b),
                d = c.closest('[data-item-id]').attr('data-item-id');
            d && !this.ids[d] && (this.addVideo(d), this.renderBtn(c.closest('.PlayableMedia-container'), d)), c.addClass(INIT_CLASS)
        })
    }

    getVideoData(a, b) {
        const c = `https://api.twitter.com/1.1/statuses/show.json?id=${a}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&trim_user=false&include_ext_media_color=true`;
        $.ajax({
            type: 'GET',
            url: c,
            dataType: 'json',
            headers: {
                Authorization: 'Bearer ' + this.oauth2_access_token
            },
            success: (c) => {
                const d = c.full_text,
                    e = [];
                c.extended_entities.media[0].video_info.variants.filter((a) => 'video/mp4' === a.content_type).forEach((b) => {
                    const c = b.url,
                        f = c.match(/vid\/(.+)\//),
                        g = f && f[1] ? f[1] : '';
                    e.push({
                        title: d,
                        url: c,
                        vid: a,
                        provider: 'tw',
                        quality: g
                    })
                }), b(e)
            }
        })
    }
};
TWProvider.OAUTH2_TOKEN_API_URL = 'https://api.twitter.com/oauth2/token', TWProvider.ENCODED_TOKEN_CREDENTIAL = 'UEtLaXU5SWpFRVNIVFJVc3Jqbkh1YzBDbDpzb1lMMWZOa3BDTmxLcDVNR0g1QkpGd09KODQwekliWGVWMHc4enFhUXBRTE4yRTJZSA==';