"use strict";

function addRow(site, url) {
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
}

function loadSites() {
    chrome.storage.sync.get("sites", (response) => {
        console.log(response);
        for (let i = 0; i < response.sites.length; i++) {
            const element = response.sites[i];
            addRow(element.site, element.url);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    loadSites();
});