"use strict";

//=== Chrome Actions ===
function getSites(callback) {
    chrome.storage.sync.get("sites", (response) => {
        callback(response.sites);
    });
}
function syncStorage(obj, callback) {
    chrome.storage.sync.set(obj, callback);
}
function createContextMenu(obj, callback) {
    chrome.contextMenus.create(obj);
}
function removeContextMenu(obj, callback) {
    chrome.contextMenus.remove(obj);
}
function updateContextMenu(id, obj, callback) {
    chrome.contextMenus.update(id, obj);
}

function addMenu(site, url, sites) {
    const menuId = `${site}_0`;
    sites.push({
        site: site,
        url: url,
        menuId: menuId
    });
    syncStorage({sites: sites});
    createContextMenu({
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

    document.querySelector("#site").value =  row.querySelector(".site").innerText;
    document.querySelector("#url").value =  row.querySelector(".url").innerText;
    var btn = document.querySelector("#editButton");
    btn.setAttribute("data-action", "update");
    btn.value = "Update";
    document.querySelector("#cancelButton").style.visibility = "visible";
    siteEntryToEdit = row.querySelector(".site").innerText;
}

function deleteButtonClicked(e, sites) {
    let row = e.target.parentNode.parentNode;

    let removeSite =  row.querySelector(".site").innerText;

    let filteredSites = sites.filter(site => site.site != removeSite);

    syncStorage({sites: filteredSites})
    removeContextMenu(`${removeSite}_0`);

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
    deleteButton.addEventListener("click", (e) => getSites((sites) => deleteButtonClicked(e, sites)));
    deleteBtnCell.appendChild(deleteButton);

    const tableBody = siteTable.querySelector("tbody");
    let newRow = document.createElement("tr");
    newRow.appendChild(siteCell);
    newRow.appendChild(urlCell);
    newRow.appendChild(btnCell);
    newRow.appendChild(deleteBtnCell);
    tableBody.appendChild(newRow);

    if (!initLoad) {
        getSites((sites) => addMenu(site, url, sites));
        defaultEditForm();
    }
}

function loadSites(sites) {
    for (let i = 0; i < sites.length; i++) {
        const element = sites[i];
        addRow(element.site, element.url, true);
    }
}

function validateData() {//todo: implement
    return {valid: true, message: "success"};
}

function updateRow(newSiteValue, newUrlValue, sites) {
    let siteCell = document.evaluate(`//td[text()="${siteEntryToEdit}"]`, document).iterateNext();
    let urlCell = siteCell.parentNode.querySelector(".url");

    let updateIndex = sites.findIndex(element => element.site == siteEntryToEdit);
    sites[updateIndex].site = newSiteValue;
    sites[updateIndex].url = newUrlValue;

    syncStorage({sites: sites});
    updateContextMenu(`${siteEntryToEdit}_0`, {
        title: newSiteValue
    });

    siteCell.innerText = newSiteValue;
    urlCell.innerText = newUrlValue;

    defaultEditForm();
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
    getSites((sites) => loadSites(sites));
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
                getSites((sites) => {
                    updateRow(
                        document.querySelector("#site").value,
                        document.querySelector("#url").value,
                        sites
                    );
                });
            }
        }
    });

    document.querySelector("#cancelButton").addEventListener("click", defaultEditForm);
});