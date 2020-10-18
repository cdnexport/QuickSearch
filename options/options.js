"use strict";

function addMenu(site, url) {
    const menuId = `${site}_0`;
    chrome.storage.sync.get("sites", (response) => {
        response.sites.push({
            site: site,
            url: url,
            menuId: menuId
        });
        chrome.storage.sync.set({sites: response.sites});
    });
    chrome.contextMenus.create({
        id: menuId,
        parentId: "quickSearchSelection",
        title: site,
        type: "normal",
        contexts: ["selection"]
    });
}

function addRow(site, url, initLoad = false) {
    const siteTable = document.querySelector("#siteTable");

    let siteCell = document.createElement("td");
    let urlCell = document.createElement("td");
    let btnCell = document.createElement("td");
    siteCell.innerText = site;
    urlCell.innerText = url;
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    btnCell.appendChild(editButton);

    const tableBody = siteTable.querySelector("tbody");
    let newRow = document.createElement("tr");
    newRow.appendChild(siteCell);
    newRow.appendChild(urlCell);
    newRow.appendChild(btnCell);
    tableBody.appendChild(newRow);

    if (!initLoad) {
        addMenu(site, url);
    }
    document.querySelector("#site").value = "";
    document.querySelector("#url").value = "";
}

function loadSites() {
    chrome.storage.sync.get("sites", (response) => {
        for (let i = 0; i < response.sites.length; i++) {
            const element = response.sites[i];
            addRow(element.site, element.url, true);
        }
    });
}

function validateData() {//todo: implement
    return {valid: true, message: "success"};
}

document.addEventListener("DOMContentLoaded", () => {
    loadSites();
    document.querySelector("#addButton").addEventListener("click", (e) => {
        var validation = validateData();
        if (validation.valid) {
            addRow(
                document.querySelector("#site").value,
                document.querySelector("#url").value
            );
        }
    });
});