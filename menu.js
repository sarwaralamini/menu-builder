/**
 * Creates a menu item element with its nested structure and functionalities.
 * @param {Object} item - The menu item data.
 * @param {string} item.id - Unique identifier for the menu item.
 * @param {string} item.title - Title of the menu item.
 * @param {string} item.url - URL of the menu item.
 * @param {string} [item.type='custom'] - Type of the menu item (e.g., 'custom', 'page').
 * @param {Array} [item.children] - Array of child menu items.
 * @returns {HTMLElement} The constructed menu item element.
 */
function createMenuItem(item) {
    // Add default type if not specified
    item.type = item.type || 'custom';

    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('draggable', 'true');
    menuItem.dataset.id = item.id;
    menuItem.dataset.type = item.type;

    const dropIndicator = document.createElement('div');
    dropIndicator.className = 'drop-indicator';
    menuItem.appendChild(dropIndicator);

    const content = document.createElement('div');
    content.className = 'card';
    
    // Create URL edit field HTML only if it's a custom link
    const urlEditField = item.type === 'custom' ? `
        <div class="mb-2">
            <label class="form-label">URL</label>
            <input type="text" class="form-control form-control-sm edit-url-input" value="${item.url}">
        </div>
    ` : '';

    content.innerHTML = `
        <div class="card-body p-2">
            <div class="d-flex justify-content-between align-items-center">
                <div class="drag-handle">☰</div>
                <div class="flex-grow-1 ms-2">
                    ${item.title}
                    <span class="menu-url">${getPathFromUrl(item.url)}</span>
                    <input type="hidden" class="full-url-input" value="${item.url}">
                    <input type="hidden" class="item-type" value="${item.type}">
                </div>
                <div class="menu-actions">
                    <button class="btn btn-sm btn-outline-secondary me-1 edit-btn">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Remove</button>
                </div>
            </div>
            <div class="edit-form">
                <div class="mb-2">
                    <label class="form-label">Menu Item Name</label>
                    <input type="text" class="form-control form-control-sm edit-title-input" value="${item.title}">
                </div>
                ${urlEditField}
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-secondary me-2 cancel-edit-btn">Cancel</button>
                    <button class="btn btn-sm btn-primary save-edit-btn">Save</button>
                </div>
            </div>
        </div>
    `;
    menuItem.appendChild(content);

    // Add event listeners for edit functionality
    const editBtn = content.querySelector('.edit-btn');
    const removeBtn = content.querySelector('.btn-outline-danger');
    const cancelBtn = content.querySelector('.cancel-edit-btn');
    const saveBtn = content.querySelector('.save-edit-btn');
    const editForm = content.querySelector('.edit-form');
    const titleInput = content.querySelector('.edit-title-input');
    const urlInput = content.querySelector('.edit-url-input');
    const titleDisplay = content.querySelector('.flex-grow-1.ms-2');
    const fullUrlInput = content.querySelector('.full-url-input');
    const itemType = content.querySelector('.item-type').value;

    editBtn.addEventListener('click', () => {
        editForm.classList.add('show');
        titleInput.focus();
        titleInput.select();
        if (urlInput) {
            urlInput.value = fullUrlInput.value;
        }
    });

    removeBtn.addEventListener('click', () => {
        const menuItem = removeBtn.closest('.menu-item');
        if (menuItem) {
            menuItem.parentNode.removeChild(menuItem);
        }
    });

    cancelBtn.addEventListener('click', () => {
        editForm.classList.remove('show');
        titleInput.value = titleDisplay.childNodes[0].textContent.trim();
        if (urlInput) {
            urlInput.value = fullUrlInput.value;
        }
    });

    saveBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        const newUrl = urlInput ? urlInput.value.trim() : item.url;
        
        if (newTitle) {
            item.title = newTitle;
            item.url = newUrl;
            fullUrlInput.value = newUrl;
            
            titleDisplay.innerHTML = `
                ${newTitle}
                <span class="menu-url">${getPathFromUrl(newUrl)}</span>
                <input type="hidden" class="full-url-input" value="${newUrl}">
                <input type="hidden" class="item-type" value="${itemType}">
            `;
            editForm.classList.remove('show');
        }
    });

    // Previous event listeners remain the same

    if (item.children && item.children.length > 0) {
        const nestedMenu = document.createElement('div');
        nestedMenu.className = 'nested-menu';
        item.children.forEach(child => {
            nestedMenu.appendChild(createMenuItem(child));
        });
        menuItem.appendChild(nestedMenu);
    } else {
        const nestedMenu = document.createElement('div');
        nestedMenu.className = 'nested-menu';
        menuItem.appendChild(nestedMenu);
    }

    return menuItem;
}

/**
 * Event listener for adding selected pages as menu items.
 * Updates the menu container with new menu items created from selected pages.
 */
document.querySelector('#pagesCollapse .btn-primary').addEventListener('click', function() {
    const checkedPages = document.querySelectorAll('#pagesCollapse input[type="checkbox"]:checked');
    checkedPages.forEach(checkbox => {
        const pageTitle = checkbox.nextElementSibling.textContent;
        const type = checkbox.nextElementSibling.nextElementSibling.textContent;
        const newItem = {
            id: nextId++,
            title: pageTitle,
            url: `/${pageTitle.toLowerCase().replace(/\s+/g, '-')}`,
            type: type
        };
        
        const menuContainer = document.getElementById('menuItems');
        const menuItemElement = createMenuItem(newItem);
        menuContainer.appendChild(menuItemElement);
        
        // Uncheck the checkbox after adding
        checkbox.checked = false;
    });
});

/**
 * Event listener for adding custom links to the menu.
 * Validates input fields and adds a new menu item based on user input.
 */
document.querySelector('#customLinksCollapse .btn-primary').addEventListener('click', function() {
    const urlInput = document.querySelector('#customLinksCollapse input[type="url"]');
    const textInput = document.querySelector('#customLinksCollapse input[type="text"]');
    const type = document.querySelector('#customLinksCollapse input[type="hidden"]');
    if (urlInput.value && textInput.value) {
        const newItem = {
            id: nextId++,
            title: textInput.value,
            url: urlInput.value,
        };
        
        const menuContainer = document.getElementById('menuItems');
        const menuItemElement = createMenuItem(newItem);
        menuContainer.appendChild(menuItemElement);
        
        // Clear inputs after adding
        urlInput.value = '';
        textInput.value = '';
    } else {
        // Optional: Add visual feedback if inputs are empty
        if (!urlInput.value) urlInput.classList.add('is-invalid');
        if (!textInput.value) textInput.classList.add('is-invalid');
        
        // Remove invalid feedback after 2 seconds
        setTimeout(() => {
            urlInput.classList.remove('is-invalid');
            textInput.classList.remove('is-invalid');
        }, 2000);
    }
});

/**
 * Removes validation error classes from the URL input field on input.
 */
document.querySelector('#customLinksCollapse input[type="url"]').addEventListener('input', function() {
    this.classList.remove('is-invalid');
});

/**
 * Removes validation error classes from the text input field on input.
 */
document.querySelector('#customLinksCollapse input[type="text"]').addEventListener('input', function() {
    this.classList.remove('is-invalid');
});

/**
 * Extracts the pathname from a given URL.
 * @param {string} url - The URL to parse.
 * @returns {string} The pathname or the original URL if parsing fails.
 */
function getPathFromUrl(url) {
    try {
        // Handle both full URLs and path-only URLs
        if (url.startsWith('http')) {
            return new URL(url).pathname;
        }
        return url; // Return as-is if it's already a path
    } catch (e) {
        return url; // Return original if URL parsing fails
    }
}

/**
 * Initializes the menu by populating the container with the initial menu items.
 */
function initializeMenu() {
    const menuContainer = document.getElementById('menuItems');
    menuContainer.innerHTML = '';
    initialMenuItems.forEach(item => {
        menuContainer.appendChild(createMenuItem(item));
    });
}


let draggedItem = null;
let dropTarget = null;
let dropPosition = 'before'; // 'before', 'after', or 'inside'

/**
 * Handles the start of a drag event.
 * Sets up the dragged item and hides its nested items during dragging.
 * @param {DragEvent} e - The dragstart event object.
 */
function handleDragStart(e) {
    draggedItem = e.target.closest('.menu-item');
    draggedItem.classList.add('dragging');
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    // Hide nested items while dragging
    const nestedMenu = draggedItem.querySelector('.nested-menu');
    if (nestedMenu) {
        nestedMenu.style.display = 'none';
    }
}


/**
 * Handles the end of a drag event.
 * Cleans up the drag state and restores visibility of nested items.
 * @param {DragEvent} e - The dragend event object.
 */
function handleDragEnd(e) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        // Show nested items again
        const nestedMenu = draggedItem.querySelector('.nested-menu');
        if (nestedMenu) {
            nestedMenu.style.display = '';
        }
    }
    // Clear all drop indicators
    document.querySelectorAll('.drop-indicator').forEach(indicator => {
        indicator.classList.remove('show', 'drop-inside');
    });
    draggedItem = null;
    dropTarget = null;
}

/**
 * Handles dragover events to update drop indicators based on the cursor position.
 * @param {DragEvent} e - The dragover event object.
 */
function handleDragOver(e) {
    e.preventDefault();
    if (!draggedItem) return;

    const target = e.target.closest('.menu-item');
    if (!target || target === draggedItem) return;

    // Clear previous indicators
    document.querySelectorAll('.drop-indicator').forEach(indicator => {
        indicator.classList.remove('show', 'drop-inside');
    });

    const rect = target.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = 5; // pixels from edge to trigger nesting
    const relativeY = mouseY - rect.top;
    
    dropTarget = target;

    if (e.clientX - rect.left > 50 && relativeY > threshold && relativeY < rect.height - threshold) {
        // Inside - nest under target
        dropPosition = 'inside';
        target.querySelector('.drop-indicator').classList.add('show', 'drop-inside');
    } else if (relativeY < rect.height / 2) {
        // Above target
        dropPosition = 'before';
        target.querySelector('.drop-indicator').classList.add('show', 'drop-inside');
    } else {
        // Below target
        dropPosition = 'after';
        target.querySelector('.drop-indicator').classList.add('show', 'drop-inside');
    }
}

/**
 * Handles drop events to reposition the dragged item in the menu.
 * Updates the item's parent or sibling relationships based on the drop position.
 * @param {DragEvent} e - The drop event object.
 */
function handleDrop(e) {
    e.preventDefault();
    if (!draggedItem || !dropTarget) return;

    // Remove from old position
    draggedItem.parentNode.removeChild(draggedItem);

    // Add to new position
    if (dropPosition === 'inside') {
        const nestedMenu = dropTarget.querySelector('.nested-menu');
        nestedMenu.appendChild(draggedItem);
    } else if (dropPosition === 'before') {
        dropTarget.parentNode.insertBefore(draggedItem, dropTarget);
    } else { // after
        dropTarget.parentNode.insertBefore(draggedItem, dropTarget.nextSibling);
    }

    // Clear states
    handleDragEnd();
}


/**
 * Initializes drag-and-drop functionality for menu items.
 * Adds global event listeners for dragstart, dragend, dragover, and drop events.
 */
function initializeDragAndDrop() {
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
}

/**
 * Generates the menu structure as a hierarchical array of objects.
 * @param {HTMLElement} container - The parent container of the menu items.
 * @returns {Array} The hierarchical menu structure.
 */
function generateMenuStructure(container) {
    const menuItems = [];
    
    container.querySelectorAll(':scope > .menu-item').forEach(itemElement => {
        const id = parseInt(itemElement.dataset.id);
        const titleElement = itemElement.querySelector('.flex-grow-1.ms-2');
        const title = titleElement.childNodes[0].textContent.trim();
        const fullUrlInput = itemElement.querySelector('.full-url-input');
        const url = fullUrlInput.value;
        const itemType = itemElement.querySelector('.item-type').value;
        
        const menuItem = {
            id: id,
            title: title,
            url: url,
            type: itemType
        };

        // Check for children
        const nestedMenu = itemElement.querySelector('.nested-menu');
        if (nestedMenu && nestedMenu.children.length > 0) {
            menuItem.children = generateMenuStructure(nestedMenu);
        }

        menuItems.push(menuItem);
    });

    return menuItems;
}

/**
 * Event listener for saving the current menu structure.
 * Logs the updated structure to the console and optionally sends it to a server.
 */
document.getElementById('saveMenuStructure').addEventListener('click', function() {
    const menuContainer = document.getElementById('menuItems');
    const updatedStructure = generateMenuStructure(menuContainer);
    
    console.log('Updated Menu Structure:', JSON.stringify(updatedStructure, null, 2));

    // Example AJAX request (commented out)
    /*
    fetch('/api/save-menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStructure)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
});

initializeMenu();
initializeDragAndDrop();