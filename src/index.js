const onclick = async (Drupal) => {
    let listRemove = document.querySelector("#course-profile-materials-folders");
    let listRoot = document.querySelector(".s-js-course-materials-full.course-materials-full.sCourse-processed");
    const expanded = Array.from(document.querySelectorAll("span.expanded")).map(n => n.parentElement.parentElement.id)

    listRemove.remove()
    let uri = window.location.href

    const html = await (await fetch(uri)).text()
    const DOC = new DOMParser().parseFromString(html, "text/html")

    listRoot.appendChild(DOC.querySelector(".full-view.s-js-materials-body.s-js-full-view"))
    Drupal.behaviors.sCourseMaterialsFolders();

    expanded.forEach(node => {
        let parnt = document.getElementById(node);
        if (parnt != null) {
            parnt.firstChild.firstChild.click();
            Array.from(document.querySelectorAll(".pending")).forEach(e => e.remove());
        }
    })
}

const formReorder = () => {
    console.log("reordering");

    // Reordering the comment list
    let anchor = document.querySelectorAll(".s_comments_level:not(.thread-root)")[0];
    let highlighted = document.querySelectorAll(".on-top.comment");
    const WarnSetter = {"set":true};
    for (let e of highlighted) {
        // console.log(e.parentElement.classList.contains("thread-root"));
        if (!e.parentElement.classList.contains("thread-root")){
            anchor.insertBefore(e.parentElement, anchor.firstChild);
            WarnSetter.set = false
        } else {
            if (!document.querySelector("#exists")) {
                let warnNoTLC = document.createElement("div");
                warnNoTLC.style.width = "100%";
                warnNoTLC.id = "exists"; 

                let warnNoTLCText = document.createElement("span");
                warnNoTLCText.innerText = "No Available Top Level Comments";
                warnNoTLCText.style.fontSize = "large";

                warnNoTLC.appendChild(warnNoTLCText);
                
                document.querySelector(".s-comments-post-form-new").appendChild(warnNoTLC)
            }
        }
        if (!WarnSetter.set) {
            document.querySelector("#exists").remove();
        }
    };

    // Reordering the dropdown
    let newanchor = document.getElementById("discussion-user-stats").firstChild;
    let newhighlighted = document.querySelectorAll(".on-top.discussion-user-filter");
    for (let e of newhighlighted) {
        newanchor.insertBefore(e, newanchor.firstChild)
    };
}

const saveButtonFunc = () => {
    let text = document.querySelector("#edit-comment_ifr").contentWindow.document.body.innerHTML;
    console.log(text);
    let Path = window.location.pathname.split("/");
    let saveKey = Path[2] + "-" + Path[6];
    localStorage.setItem(saveKey, text);
}

const restoreButtonFunc = () => {
    let Path = window.location.pathname.split("/");
    let saveKey = Path[2] + "-" + Path[6];
    let text = localStorage.getItem(saveKey)
    document.querySelector("#edit-comment_ifr").contentWindow.document.body.innerHTML = text;
}
    
async function getEmails(anchor) {
    let uri = window.location.href.replace("materials", "members");
    fetch(uri)
        .then((res) => res.text())
        .then((res) => {
            const DOC = new DOMParser().parseFromString(res, "text/html");
            let courseAdmins = DOC.querySelectorAll(".enrollment-admin");
            for (let admin of courseAdmins){
                fetch(window.location.origin + "/user/" + admin.id + "/info")
                    .then((res) => res.text())
                    .then((res) => {
                    const userDOC = new DOMParser().parseFromString(res, "text/html");
                    let emailText = userDOC.getElementsByClassName("email")[0].firstChild.innerText;
                    let emailsContainer = document.createElement("dl");
                    let emailsElement = document.createElement("a");
                        emailsElement.innerText = emailText;
                        emailsElement.href = "mailto:" + emailText;

                    emailsContainer.appendChild(emailsElement);
                    anchor.appendChild(emailsContainer);
                });
            }
        });
}

async function main() {
    // Adding reload button
    if (document.querySelector(".realm-top-right") || document.querySelector("#toolbar-options-wrapper")) {
        let reloadAnchor = document.querySelector(".realm-top-right");
        let reloadDivElement = document.createElement("div");
        let reloadElement = document.createElement("a");
        let reloadElementText = document.createElement("span");
    
        if (!reloadAnchor) {
            reloadAnchor = document.querySelector("#toolbar-options-wrapper");
        }
    
        reloadElement.classList.add("link-btn");
        reloadElement.setAttribute("id", "dingus")
    
        reloadDivElement.style = "float: left;";
        
        reloadElement.setAttribute("onclick", `(${onclick})(Drupal);`)
        reloadElementText.innerText = "Reload";
        reloadAnchor.style="max-width: 100%;";
    
        reloadElement.appendChild(reloadElementText);
        reloadDivElement.appendChild(reloadElement);
        reloadAnchor.appendChild(reloadDivElement);
    }

    console.log("checking for playposit button")

    if (document.getElementsByClassName("fullscreen-option")[0]) {
        let anchor = document.getElementsByClassName("fullscreen-option")[0];
        anchor.children[0].remove();
        let newButton = document.createElement("span");
        let empty = document.createElement("span");
        newButton.classList.add("link-btn");
        newButton.classList.add("fullscreen");
        newButton.appendChild(empty);
        newButton.setAttribute("onclick", "document.getElementsByTagName('iframe')[0].requestFullscreen()");
        anchor.appendChild(newButton);
    }

    console.log("checking if inside a discussion board");

    if (document.getElementById("s_comments")) {
        let htmlCollectionList = document.getElementById("discussion-user-stats").children[0].children
        for (let item of htmlCollectionList) {
            item.setAttribute("onclick", `(${formReorder})(Drupal);`)
        }

        let submitButton = document.querySelector("#edit-submit");

        let saveButtonWrapper = document.createElement("span");
        let saveButton = document.createElement("h3");
        saveButtonWrapper.classList = "link-btn";
        saveButtonWrapper.style = "margin-top: 10px; margin-left: 6px;";
        saveButton.innerText = "Save";
        saveButton.setAttribute("type", "submit")
        saveButton.style = "padding-left: 0.1rem;";
        saveButton.setAttribute("onclick", `(${saveButtonFunc})()`)
        saveButtonWrapper.appendChild(saveButton);
        submitButton.parentElement.parentElement.appendChild(saveButtonWrapper);

        let restoreButtonWrapper = document.createElement("span");
        let restoreButton = document.createElement("h3");
        restoreButtonWrapper.classList = "link-btn";
        restoreButtonWrapper.style = "margin-top: 10px; margin-left: 6px;";
        restoreButton.innerText = "Restore";
        restoreButton.setAttribute("type", "submit")
        restoreButton.style = "padding-left: 0.1rem;";
        restoreButton.setAttribute("onclick", `(${restoreButtonFunc})()`)
        restoreButtonWrapper.appendChild(restoreButton);
        submitButton.parentElement.parentElement.appendChild(restoreButtonWrapper);
    }

    console.log("Checking for sidebar");
    // 
    let sidebar = document.querySelector("#left-nav");
    if (sidebar) {
        let information = document
            .querySelector("#content-left")
            .querySelector(".left-block-wrapper");
        
        let email = document.createElement("h3");
            email.classList = "h3-med-flat";
            email.innerText = "Emails";
        
        let emailsDivContainer = document.createElement("div");
            emailsDivContainer.classList = "course-info-wrapper sCourse-processed";
        
        let emailsLeftBlock = document.createElement("div");
            emailsLeftBlock.classList = "left-block";

        emailsLeftBlock.appendChild(emailsDivContainer);
        information.append(email);
        information.append(emailsLeftBlock);

        await getEmails(emailsLeftBlock)
        }
}

main();
