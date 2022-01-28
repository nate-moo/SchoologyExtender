const onclick = async (Drupal) => {
    let listRemove = document.querySelector("#course-profile-materials-folders");
    let listRoot = document.querySelector(".s-js-course-materials-full.course-materials-full.sCourse-processed");
    const expanded = Array.from(document.querySelectorAll("span.expanded")).map(n => n.parentElement.parentElement.id)

    listRemove.remove()
    let uri = window.location.href

    const html = await (await fetch(uri)).text()
    const DOC = new DOMParser().parseFromString(html, "text/html")

    listRoot.appendChild(DOC.querySelector(".full-view.s-js-materials-body.s-js-full-view"))
    console.log("bing bong");
    Drupal.behaviors.sCourseMaterialsFolders();

    expanded.forEach(node => {
        let parnt = document.getElementById(node);
        if (parnt != null) {
            parnt.firstChild.firstChild.click();
            Array.from(document.querySelectorAll(".pending")).forEach(e => e.remove());
         }
     })
}



function main() {
    if (document.querySelector(".realm-top-right") || document.querySelector("#toolbar-options-wrapper")) {
        let reloadAnchor = document.querySelector(".realm-top-right");
        let reloadAnchor2 = document.querySelector("#toolbar-options-wrapper");
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
        //newButton.style.width = "10%";
        //newButton.style.height = "10%";
        newButton.appendChild(empty);
        newButton.setAttribute("onclick", "document.getElementsByTagName('iframe')[0].requestFullscreen()");
        anchor.appendChild(newButton);
    }
}

main();
