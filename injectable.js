"use strict";

document.onmouseup = (e) => {
    if (e.button === 2) {
        chrome.runtime.sendMessage({
            searchText: window.getSelection().toString()
        });
    }
}
