main();

function main() {
    let reloadAnchor = document.getElementsByClassName("realm-top-right")[0];
    let reloadAnchor2 = document.getElementById("toolbar-options-wrapper");
    let reloadDivElement = document.createElement("div");
    let reloadElement = document.createElement("a");
    let reloadElementText = document.createElement("span");

    if (!reloadAnchor) {
        reloadAnchor = document.getElementById("toolbar-options-wrapper");
    }
    reloadElement.classList.add("link-btn");
    reloadElement.setAttribute("id", "dingus")

    reloadDivElement.style = "float: left;";

    reloadElement.setAttribute("onclick", `
        let listRemove = document.getElementById("course-profile-materials-folders");
        let listRoot = document.getElementsByClassName("s-js-course-materials-full course-materials-full sCourse-processed")[0];
        let expanded = [];
        document.querySelectorAll("span.expanded").forEach(function(n) {
            expanded.push(n.parentElement.parentElement.id);
        })
        
        listRemove.remove();

        let uri

        if (document.URL.includes("?f=")){
            uri = document.URL
        } else {
            uri = document.URL
        }




        fetch(uri)
            .then(res => res.text())
            // .then(res => console.log(res))
            .then(res => {
                res = res.toString()
                let doc = new DOMParser();
                let parsedElements = doc.parseFromString(res, "text/html");
                let appendableElements = parsedElements.getElementsByClassName("full-view s-js-materials-body s-js-full-view")[0]
                // appendableElements.getElementsByTagName("table")[0].id = "folder-contents-table";
                listRoot.appendChild(appendableElements);
                // document.getElementsByClassName("s-js-course-materials-simple course-materials-simple")[0].classList = "s-js-course-materials-full course-materials-full"
                // let main = document.getElementsByClassName("simple-view course-materials-folders")[0]
                // main.classList = "full-view s-js-materials-body s-js-full-view";
                // main.setAttribute("id","course-profile-materials-folders");
                console.log("bing bong");
                Drupal.behaviors.sCourseMaterialsFolders();
                
                expanded.forEach(function (n) {
                    
                    let parnt = document.getElementById(n);
                    if (parnt != null) {
                        parnt.firstChild.firstChild.click();
                        let pending = document.getElementsByClassName("pending");
                        for (let i = 0; i < pending.length; i++) {
                            pending[i].remove();
                        }
                        // expanded.pop(n);
                    }
                })
                
            });
            
    `);

    reloadElementText.innerText = "Reload";

    reloadAnchor.style="max-width: 100%;";



    reloadElement.appendChild(reloadElementText);
    reloadDivElement.appendChild(reloadElement);
    reloadAnchor.appendChild(reloadDivElement);
    return;

}