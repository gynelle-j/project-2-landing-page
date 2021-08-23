const navBarList = document.getElementById('navbar__list');
const sections = document.querySelectorAll('section');

let clickToScroll = false; // Global variable to enable/disable scrolling using .scrollTo


// Main Functions
buildNavBar();
setupNavigationEventListeners();
buildScrollTo();
buildScrollNavHighlighting();
scrollEndEventListener(); //Used to switch on and off scrolling event with clickToScroll variable


//Build the Navigation Bar based on existing sections in the HTML
function buildNavBar () {
    // Iterate through each section. Using normal for loop to access the iterator.
    for(let i = 0; i < sections.length; i++){
        const section = sections[i];
        //Build elements
        let navItem = document.createElement('li');
        let navItemLink = document.createElement('a')
            navItemLink.className ='menu__link';
            navItemLink.textContent = section.dataset.nav;
            navItemLink.href = `#section${i + 1}`; //encode the section name as the href using the current index 

        navItem.appendChild(navItemLink);
        navBarList.appendChild(navItem);
    }
}

//Add an event listener to set navigation links as active or inactive
function setupNavigationEventListeners(){
    for(const listElement of navBarList.children){
        listElement.addEventListener("click", function() {
            setNavActive(listElement); 
        });
    };
}

//Add an event listener on 'click' to scroll to the associated <section>
function buildScrollTo(){
    const navLinks = document.querySelectorAll(".navbar__menu a");
    for(link of navLinks){
        link.addEventListener("click", function(event){
            clickToScroll = true; // set clickToScroll as true to avoid scroll triggering navigation bar menu updates
            event.preventDefault() // Override js default behaviour to jump to the link
            document.querySelector(this.getAttribute('href')).scrollIntoView(
                { behavior: "smooth", block: "start", inline: "center"}
            ); //Scroll to the element that matches the nav link attribute
        });
    };
}

// Add a global event listener for 'scroll' to check whether a <section> is currently visible in the window
function buildScrollNavHighlighting(){
    window.addEventListener('scroll', function(event){
        if(clickToScroll == false) { // Check that the scroll event isn't being triggered by .scrollTo on the nav
            // Handle multiple supported methods to get window properties
            let windowWidth = (window.innerWidth || document.documentElement.clientWidth);
            let windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            
            // Check if the section is on the page, and if so update the navigation to be active.
            for(sectionElement of sections){
                const section = sectionElement.getBoundingClientRect();
                if( section.top >= 0 && 
                    section.left >= 0 &&
                    section.right <= windowWidth &&
                    section.bottom <= windowHeight 
                ) {
                    setNavActive(getNavItemForSection(sectionElement));
                }
            }
        }
    });
}

// Helper function to get the navigation item for the section
// Returns the parent element to the caller
function getNavItemForSection(section){
    const navLinks = document.querySelectorAll("#navbar__list a");
    for(link of navLinks){
        if(link.getAttribute("href") === `#${section.id}`){
            return link.parentElement;
        }
    }
}

// Helper function to get the navigation bar active state on the provided element
function setNavActive(activeElement){
    activeElement.classList.add("active");
    // Clear other nav elements
    const parentElement = activeElement.parentElement;

    for(sibling of parentElement.children){
        if(sibling !== activeElement){
            sibling.classList.remove("active");
        }
    }
}

//Helper function to detect if scrolling has stopped.
//This is used to set clickToScroll to false once .scrollTo has completed, re-enabling the scrolling event
function scrollEndEventListener(){
    var scrollTimeout;
    addEventListener('scroll', function(e) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            clickToScroll = false;
        }, 100);
});
}