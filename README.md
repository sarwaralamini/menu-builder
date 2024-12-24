
# Menu Builder

## Overview
The **Menu Builder** is a powerful and user-friendly tool designed to manage and create menu structures with functionality similar to the **WordPress Menu Builder**. It is built using **Bootstrap 5** for a modern and responsive design and **vanilla JavaScript** for a lightweight, dependency-free experience. This tool is ideal for developers integrating menu management into web applications or content management systems.

## Features

### 1. Drag-and-Drop Interface
- Intuitive drag-and-drop functionality for reordering or nesting menu items.
- Visual indicators to highlight the exact drop position (before, after, or inside).

### 2. Dynamic Menu Item Creation
- Add menu items dynamically from predefined lists (e.g., pages, categories).
- Create custom links with editable titles and URLs.

### 3. Inline Editing
- Modify menu item properties such as titles and URLs directly in the interface.
- Supports live editing with immediate updates.

### 4. Multi-Level Nesting
- Create complex menus with unlimited levels of nesting.
- Drag-and-drop to organize items hierarchically.

### 5. Real-Time Validation
- Built-in validation for required fields like titles and URLs.
- Visual feedback for incomplete or invalid inputs.

### 6. Item Removal
- Easily delete menu items with a single click on the "Remove" button.

### 7. Responsive Design
- Fully responsive layout using **Bootstrap 5**, ensuring compatibility with different screen sizes.

### 8. JSON Export
- Generates a structured JSON representation of the menu.
- Easily integrate the menu structure with APIs or server-side logic.

## Technologies Used
- **Bootstrap 5**: Provides modern, responsive design components and utility classes.
- **Vanilla JavaScript**: Ensures lightweight, dependency-free functionality.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/menu-builder.git
   ```
2. Open the project directory:
   ```bash
   cd menu-builder
   ```
3. Open `index.html` in your preferred browser to start using the Menu Builder.

## Usage
1. Add menu items from the **Pages** or **Custom Links** sections.
2. Drag and drop items to reorder or nest them.
3. Edit item titles and URLs directly in the interface.
4. Click the **Save Menu** button to export the menu structure as JSON.

## Example Output
The generated JSON structure:
```json
[
  {
    "id": 1,
    "title": "Home",
    "url": "/home",
    "type": "page",
    "children": [
      {
        "id": 2,
        "title": "Subpage",
        "url": "/home/subpage",
        "type": "page"
      }
    ]
  },
  {
    "id": 3,
    "title": "Contact",
    "url": "/contact",
    "type": "custom"
  }
]
```

This project is licensed under the [MIT License](LICENSE).
