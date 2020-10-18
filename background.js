"use strict";

function prepareSelectionText(unpreppedSearchString) {
    return unpreppedSearchString.replace(" ","+");
}

function search(url, selectionText) {
    chrome.tabs.create({
        url: `${url}${prepareSelectionText(selectionText)}`
    });
}

function buildTree(data, parentId) {
    for (let i = 0; i < data.length; i++) {
        const site = data[i];

        chrome.contextMenus.create({
            id: site.menuId,
            parentId: parentId,
            title: site.site,
            type: "normal",
            contexts: ["selection"]
        });
    }
}
chrome.runtime.onInstalled.addListener(function() {
    var defaultSites = [
        {
            site: "Youtube",
            url: "https://www.youtube.com/results?search_query=",
            menuId: "Youtube_0"
        },
        {
            site: "StackOverflow",
            url: "https://stackoverflow.com/search?q=",
            menuId: "StackOverflow_0"
        }
    ];
    chrome.contextMenus.create({
        title: "Quick Search '%s'",
        contexts: ["selection"],
        id: "quickSearchSelection",
    }, () => buildTree(defaultSites, "quickSearchSelection"));

    chrome.storage.sync.set({sites: defaultSites});
});

chrome.contextMenus.onClicked.addListener(function (e) {
    chrome.storage.sync.get('sites', (data) => {
        search(data.sites.find(element => element.menuId == e.menuItemId).url, e.selectionText);
    });
});
