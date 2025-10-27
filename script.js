// Dynamic content loading for the static wiki mirror
document.addEventListener('DOMContentLoaded', function () {
    // Handle sidebar navigation clicks
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('?page=')) {
                // Extract page name from search parameter
                const pageName = href.replace('?page=', '');
                loadPage(`pages/${pageName}`);

                // Update active state
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Update URL with search parameter
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('page', pageName);
                history.pushState({}, '', newUrl);
            }
        });
    });

    // Function to load page content dynamically
    function loadPage(url) {
        // Ensure the URL points to the pages folder
        const fullUrl = url.startsWith('pages/') ? url : `pages/${url}`;

        // Show loading state
        const contentArea = document.querySelector('.content');
        contentArea.innerHTML = '<div style="padding: 20px; text-align: center;"><div>Loading...</div></div>';

        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Extract the main content from the loaded page
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const pageContent = doc.querySelector('.page-content');
                const pageHeader = doc.querySelector('.page-header');
                const title = doc.querySelector('title').textContent;

                if (pageContent) {
                    // Update the main content area with both header and content
                    let contentHTML = '';
                    if (pageHeader) {
                        contentHTML += pageHeader.outerHTML;
                    }
                    contentHTML += pageContent.outerHTML;

                    contentArea.innerHTML = contentHTML;

                    // Update the page title
                    document.title = title;

                    // Don't change the URL - keep it on the main page
                } else {
                    throw new Error('No content found in the page');
                }
            })
            .catch(error => {
                console.error('Error loading page:', error);
                contentArea.innerHTML = `
                    <div class="page-header">
                        <h1>Error</h1>
                    </div>
                    <div class="page-content">
                        <p>Could not load the requested page: ${fullUrl}</p>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            });
    }

    // Handle URL search parameters for direct linking
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');

        if (page) {
            // Load the specified page
            loadPage(`pages/${page}`);

            // Update active state for the loaded page
            const targetLink = document.querySelector(`a[href="?page=${page}"]`);
            if (targetLink) {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
            }
        }
    }

    // Handle browser back/forward buttons with search params
    window.addEventListener('popstate', function (e) {
        handleURLParams();
    });

    // Initialize page based on URL search parameters
    handleURLParams();

    // Initialize accordions
    initializeAccordions();

    // Accordion functionality
    function initializeAccordions() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');

        // Load saved accordion states
        loadAccordionStates();

        accordionHeaders.forEach(header => {
            header.addEventListener('click', function (e) {
                // Check if clicking on the chevron or empty space
                const isChevronClick = e.target === this || e.target.classList.contains('accordion-toggle');
                const isLinkClick = e.target.tagName === 'A' && !isChevronClick;

                if (isLinkClick) {
                    // Let the link handle navigation normally
                    return;
                }

                // Prevent default for accordion toggle
                e.preventDefault();
                e.stopPropagation();

                const targetId = this.getAttribute('data-target');
                const content = document.getElementById(targetId);

                if (content) {
                    // Toggle collapsed state
                    const isCollapsed = content.classList.contains('collapsed');

                    if (isCollapsed) {
                        // Expand
                        content.classList.remove('collapsed');
                        this.classList.remove('collapsed');
                    } else {
                        // Collapse
                        content.classList.add('collapsed');
                        this.classList.add('collapsed');
                    }

                    // Save state to localStorage
                    saveAccordionState(targetId, !isCollapsed);
                }
            });
        });

        // Set initial state for main sections if no saved state
        const mainSections = ['company-overview', 'principle-photography', 'checklists', 'materials'];
        mainSections.forEach(sectionId => {
            const content = document.getElementById(sectionId);
            if (content && !hasSavedState(sectionId)) {
                content.classList.remove('collapsed');
            }
        });
    }

    // Save accordion state to localStorage
    function saveAccordionState(accordionId, isExpanded) {
        const states = getAccordionStates();
        states[accordionId] = isExpanded;
        localStorage.setItem('accordionStates', JSON.stringify(states));
    }

    // Load accordion states from localStorage
    function loadAccordionStates() {
        const states = getAccordionStates();

        Object.keys(states).forEach(accordionId => {
            const content = document.getElementById(accordionId);
            const header = document.querySelector(`[data-target="${accordionId}"]`);

            if (content && header) {
                if (states[accordionId]) {
                    // Expanded
                    content.classList.remove('collapsed');
                    header.classList.remove('collapsed');
                } else {
                    // Collapsed
                    content.classList.add('collapsed');
                    header.classList.add('collapsed');
                }
            }
        });
    }

    // Get accordion states from localStorage
    function getAccordionStates() {
        try {
            const saved = localStorage.getItem('accordionStates');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    // Check if accordion has saved state
    function hasSavedState(accordionId) {
        const states = getAccordionStates();
        return accordionId in states;
    }

});
