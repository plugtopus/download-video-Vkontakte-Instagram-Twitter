window.runVlcApp(), window.onbeforeunload = function () {
    localStorage.removeItem('activeWindowId')
};