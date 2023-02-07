const reload = async (Drupal) => {
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
    }

    // Reordering the dropdown
    let newanchor = document.getElementById("discussion-user-stats").firstChild;
    let newhighlighted = document.querySelectorAll(".on-top.discussion-user-filter");
    for (let e of newhighlighted) {
        newanchor.insertBefore(e, newanchor.firstChild)
    }
}

const saveButtonFunc = (itr) => {
    let text = document.querySelectorAll(".mceIframeContainer")[itr].children[0].contentWindow.document.body.innerHTML;
    console.log(text);
    let Path = window.location.pathname.split("/");
    let saveKey = Path[2] + "-" + Path[6] + "-" + itr;
    localStorage.setItem(saveKey, text);
}

const restoreButtonFunc = (itr) => {
    let Path = window.location.pathname.split("/");
    let saveKey = Path[2] + "-" + Path[6] + "-" + itr;
    let text = localStorage.getItem(saveKey)
    document.querySelectorAll(".mceIframeContainer")[itr].children[0].contentWindow.document.body.innerHTML = text;
}
    
async function getEmails(anchor) {
    let Path = window.location.pathname.split("/");
    let emailKey = Path[2] + "-" + "course-emails";
    let emailText = sessionStorage.getItem(emailKey)

    if (emailText === null) {
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
                        emailText = userDOC.getElementsByClassName("email")[0].firstChild.innerText;
                        let emailsContainer = document.createElement("dl");
                        let emailsElement = document.createElement("a");
                            emailsElement.innerText = emailText;
                            emailsElement.href = "mailto:" + emailText;
    
                        emailsContainer.appendChild(emailsElement);
                        anchor.appendChild(emailsContainer);
                        
                        sessionStorage.setItem(emailKey, emailText);
                    });
                }
            });
    } else {
        let emailsContainer = document.createElement("dl");
        let emailsElement = document.createElement("a");
            emailsElement.innerText = emailText;
            emailsElement.href = "mailto:" + emailText;
    
        emailsContainer.appendChild(emailsElement);
        anchor.appendChild(emailsContainer);
    }

    
}

function saveButtonC(itr) {
    let saveButtonWrapper = document.createElement("span");
    let saveButton = document.createElement("h3");
    saveButtonWrapper.classList = "link-btn";
    saveButtonWrapper.style = "margin-top: 10px; margin-left: 6px;";
    saveButton.innerText = "Save";
    saveButton.setAttribute("type", "submit")
    saveButton.style = "padding-left: 0.1rem;";
    saveButton.setAttribute("onclick", `(${saveButtonFunc})(${itr})`)
    return [saveButtonWrapper, saveButton]
    //saveButtonWrapper.appendChild(saveButton);
    //submitButton.parentElement.parentElement.appendChild(saveButtonWrapper);
}
function restoreButtonC(submitButton, itr) {
    let restoreButtonWrapper = document.createElement("span");
    let restoreButton = document.createElement("h3");
    restoreButtonWrapper.classList = "link-btn";
    restoreButtonWrapper.style = "margin-top: 10px; margin-left: 6px;";
    restoreButton.innerText = "Restore";
    restoreButton.setAttribute("type", "submit")
    restoreButton.style = "padding-left: 0.1rem;";
    restoreButton.setAttribute("onclick", `(${restoreButtonFunc})(${itr})`)
    return [restoreButtonWrapper, restoreButton]
    //restoreButtonWrapper.appendChild(restoreButton);
    //submitButton.parentElement.parentElement.appendChild(restoreButtonWrapper);
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
        
        reloadElement.setAttribute("onclick", `(${reload})(Drupal);`)
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

        let submitButtons = document.querySelectorAll(".form-submit");
        for (let [itr, el] of submitButtons.entries()) {
            let [saveWrapper, save] = saveButtonC(itr);
            let [restoreWrapper, restore] = restoreButtonC(save, itr);
            saveWrapper.appendChild(save);
            el.parentElement.parentElement.appendChild(saveWrapper);
            restoreWrapper.appendChild(restore);
            el.parentElement.parentElement.appendChild(restoreWrapper);
        } 

    }

    console.log("Checking for sidebar");
    // 
    let sidebar = document.querySelector("#left-nav");
    if (sidebar) {
        let information = document
            .querySelector("#content-left")
            .querySelector(".left-block-wrapper");
                console.log("Checking date information");
        let gradePeriodElem = document.querySelector(".course-info-wrapper > dl > dd");

        let dayCount1 = ((Date.parse(gradePeriodElem.textContent.split(",")[0].split(" - ")[1]) - new Date().getTime())/1000/60/60/24/7).toFixed(1);
        if (dayCount1 < 0) { dayCount1 = "Past" }
        
        gradePeriodElem.textContent.split(",").forEach((i) => {
            let dayCount = ((Date.parse(i.split(" - ")[1]) - new Date().getTime())/1000/60/60/24/7).toFixed(1);
            
            let dayCountElem = document.createElement("dd");
            if (dayCount > 0) {;
                dayCountElem.innerText = (dayCount.split(".")[0]) + " Weeks " + ((dayCount * 7) % 7).toFixed(1) + " Days";
                dayCountElem.title =  (a%7 + (Number(String(a/7).split(".")[0])*5)) + " Days"
            } else {
                dayCountElem.innerText = "Past";
            }
            let dayCountElemTitle = document.createElement("dt");
                dayCountElemTitle.innerText = "Weeks left in " + i.trim().substring(0,3);
                gradePeriodElem.parentElement.appendChild(dayCountElemTitle);
                gradePeriodElem.parentElement.appendChild(dayCountElem);
        })

        information.querySelector("h3").innerText = "Grading Period";
        
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

        await getEmails(emailsLeftBlock);
        //
    }
    
}

main();
