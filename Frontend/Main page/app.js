function openTab(event, tabName) {
    // Get all elements with class="tab-content" and hide them
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active-content');
    }

    // Get all elements with class="tab-link" and remove the class "active"
    let tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add('active-content');
    event.currentTarget.classList.add("active");
}
