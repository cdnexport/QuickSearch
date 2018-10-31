"use strict";
var link;

function openSearchTab(link) {
    chrome.tabs.create({
        url: link
    });
}

function sanitizeSearchString(unpreppedSearchString) {
    return unpreppedSearchString.replace(" ","+");
}

function getLink(searchString, callback) {
    const youtubeBaseURL = "https://www.youtube.com";
    const preppedSearchString = sanitizeSearchString(searchString);
    
    var requester = new XMLHttpRequest();

    requester.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const regex = /(\/watch\?v=.{11})/gm;
            link = youtubeBaseURL + requester.response.match(regex);
        }
        else {
            console.log("Failure");
        }
    };

    requester.open("GET", youtubeBaseURL + "/results?search_query=" + preppedSearchString, true);
    requester.send();
}

chrome.runtime.onInstalled.addListener(function() {
    var context = "selection";
    chrome.contextMenus.create({
        title: "Search '%s' with QuickTube.",
        contexts: [context],
        id: "context" + context,
    });
});

chrome.contextMenus.onClicked.addListener(function (e) {
    openSearchTab(link);
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    getLink(request.searchText);
});
