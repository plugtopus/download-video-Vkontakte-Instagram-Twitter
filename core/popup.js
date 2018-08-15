chrome['tabs'].query({
    active: !0,
    currentWindow: !0
}, (a) => {
    if (!a || !a[0].id) return;
    const b = a[0].id,
        c = a[0].url;
    chrome.storage.local.get({
        store: {
            mode: 'popup'
        }
    }, (a) => {
        const c = a.store.mode;
        'popup' === c ? window.runVlcApp() : 'sidebar' === c && (chrome['tabs'].sendMessage(b, {
            action: 'openAppInSidebar'
        }), window.close())
    })
});