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

var siteEntryToEdit = null;
function editButtonClicked(e) {
    let row = e.target.parentNode.parentNode;
    console.log(row);
    document.querySelector("#site").value =  row.querySelector(".site").innerText;
    document.querySelector("#url").value =  row.querySelector(".url").innerText;
    var btn = document.querySelector("#editButton");
    btn.setAttribute("data-action", "update");
    btn.value = "Update";
    document.querySelector("#cancelButton").style.visibility = "visible";
    siteEntryToEdit = row.querySelector(".site").innerText;
    console.log(siteEntryToEdit);
}

function deleteButtonClicked(e) {
    let row = e.target.parentNode.parentNode;

    let removeSite =  row.querySelector(".site").innerText;
    chrome.storage.sync.get("sites", (response) => {
        let sites = response.sites.filter(site => site.site != removeSite);

        chrome.storage.sync.set({sites: sites});
        chrome.contextMenus.remove(`${removeSite}_0`);
    });

    row.remove();
}

function addRow(site, url, initLoad = false) {
    const siteTable = document.querySelector("#siteTable");

    let siteCell = document.createElement("td");
    let urlCell = document.createElement("td");
    let btnCell = document.createElement("td");
    let deleteBtnCell = document.createElement("td");
    siteCell.innerText = site;
    siteCell.classList.add("site");
    urlCell.innerText = url;
    urlCell.classList.add("url");

    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("update");
    editButton.addEventListener("click", editButtonClicked);
    btnCell.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", deleteButtonClicked);
    deleteBtnCell.appendChild(deleteButton);

    const tableBody = siteTable.querySelector("tbody");
    let newRow = document.createElement("tr");
    newRow.appendChild(siteCell);
    newRow.appendChild(urlCell);
    newRow.appendChild(btnCell);
    newRow.appendChild(deleteBtnCell);
    tableBody.appendChild(newRow);

    if (!initLoad) {
        addMenu(site, url);
        defaultEditForm();
    }
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

function updateRow(site, url) {
    let siteCell = document.evaluate(`//td[text()="${siteEntryToEdit}"]`, document).iterateNext();
    let urlCell = siteCell.parentNode.querySelector(".url");
    chrome.storage.sync.get("sites", (response) => {
        let sites = response.sites;
        console.log(siteEntryToEdit);
        let updateIndex = sites.findIndex(element => element.site == siteEntryToEdit);
        console.log(updateIndex);
        sites[updateIndex].site = site;
        sites[updateIndex].url = url;

        chrome.storage.sync.set({sites: sites});
        chrome.contextMenus.update(`${siteEntryToEdit}_0`, {
            title: site
        });

        siteCell.innerText = site;
        urlCell.innerText = url;

        defaultEditForm();
    });
}

function defaultEditForm() {
    siteEntryToEdit = null;
    document.querySelector("#site").value = "";
    document.querySelector("#url").value = "";
    document.querySelector("#editButton").value = "Add";
    document.querySelector("#editButton").setAttribute("data-action", "add");
    document.querySelector("#cancelButton").style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded", () => {
    loadSites();
    document.querySelector("#editButton").addEventListener("click", (e) => {
        var validation = validateData();
        if (validation.valid) {
            let action = e.target.getAttribute("data-action");
            if (action === "add") {
                addRow(
                    document.querySelector("#site").value,
                    document.querySelector("#url").value
                );
            }
            else if (action === "update") {
                updateRow(
                    document.querySelector("#site").value,
                    document.querySelector("#url").value
                );
            }
        }
    });

    document.querySelector("#cancelButton").addEventListener("click", defaultEditForm);
});