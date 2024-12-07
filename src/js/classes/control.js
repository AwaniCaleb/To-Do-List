import { Builder } from "./builder";
import { SystemError } from "../modules/errorHandler";
import { TodoManager } from "../modules/todoManager";


// Define the Control class, which manages rendering and interactions for the To-Do application
export class Control {

    /**
     * Initializes the application by rendering necessary UI components.
     * Calls static methods to render the new to-do section and the appropriate tab.
     */
    static init() {
        Control.renderNewTodoSection(); // Render the section for adding new to-dos
        Control.renderTab(Control.targetTab()); // Render the tab (defaults to "pending")
        Control.handleTabClick(); // Set up tab click handling
    }

    /**
     * Renders the to-do list based on the selected tab.
     * @param {string} tab - Specifies the tab to render. Defaults to "pending".
     * If "pending", shows uncompleted tasks; otherwise, shows completed tasks.
     */
    static renderTab(tab = "pending") {
        // Create a new instance of TodoManager, which manages the list of todos
        const TDM = new TodoManager();

        // List of valid tabs, their anchors, and sections
        let tabs = ["pending", "completed"],
            tabSections = {
                "pending": document.getElementById("pending-todo-section"),
                "completed": document.getElementById("completed-todo-section")
            },
            tabAnchors = {
                "pending": document.getElementById("pending-todo-tab"),
                "completed": document.getElementById("completed-todo-tab")
            };

        // If the specified tab is invalid, default to "pending"
        if (!tabs.includes(tab)) tab = "pending";

        // Handle active classes and visibility dynamically
        for (const key in tabSections) {
            if (tabSections[key]) {
                tabSections[key].classList.toggle("hidden", key !== tab); // Show selected section, hide others
            }
            if (tabAnchors[key]) {
                tabAnchors[key].classList.toggle("active", key === tab); // Highlight selected tab, unhighlight others
            }
        }

        // Retrieve the filtered todos based on the selected tab
        let todos = (tab === "pending")
            ? TDM.filterTodos({ filter: "pending", sortKey: "createdAt", ascending: false }) // Fetch pending todos
            : TDM.filterTodos({ filter: "completed", sortKey: "createdAt" }); // Fetch completed todos

        // Clear the todo list for the selected section
        const todoList = tabSections[tab].querySelector("[d-c='todo-list']");
        Builder.wipe(todoList) // Clear existing elements

        // Handle empty state
        if (todos.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.className = "text-gray-500 text-center py-4";
            emptyMessage.textContent = (tab === "pending")
                ? "You have no pending tasks. Add some new tasks to get started!"
                : "No completed tasks yet. Check back after marking some as done.";

            todoList.appendChild(emptyMessage); // Add the empty state message to the section
            return;
        }

        // Render the todos for the selected tab
        let elements = [];
        todos.forEach(todo => {
            elements.push(Builder.newTodoElement({completed: (tab == "completed") ? true : false, data: todo }));
        });

        elements.forEach(element => {
            todoList.appendChild(element.element);
        });
    }

    /**
     * Attaches click event listeners to tab anchors and handles tab switching.
     */
    static handleTabClick() {
        // List of valid tabs, their anchors, and sections
        let tabAnchors = {
            "pending": document.getElementById("pending-todo-tab"),
            "completed": document.getElementById("completed-todo-tab")
        };

        // Attach event listeners to each tab anchor
        for (const tab in tabAnchors) {
            if (tabAnchors[tab]) {
                tabAnchors[tab].addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent default anchor behavior
                    Control.renderTab(tab); // Render the clicked tab
                });
            }
        }
    }

    /**
     * Renders the "New To-Do Section" dynamically using the Builder class.
     * Ensures that any previously existing section is replaced with the new one.
     * Throws an error if the old section cannot be found or is invalid.
     */
    static renderNewTodoSection() {
        // Generate the new To-Do section using the Builder class
        let nts = Builder.newTodoSection();

        // Attempt to locate the old "New To-Do Section" in the DOM by ID
        let onts = document.getElementById(nts.section.id);

        // Check if the old section exists and is a valid HTMLElement
        if (!onts || !(onts instanceof HTMLElement)) {
            throw new SystemError("Old 'New Todo Section' was not found or is invalid");
        }

        // Replace the old section with the newly generated section
        onts.replaceWith(nts.section);
    }

    /**
     * Retrieves the currently targeted tab from the URL parameters.
     * @returns {string|null} The value of the "t" parameter from the URL, or null if not present.
     */
    static targetTab() {
        // Parse the URL query string to find the "t" parameter (e.g., ?t=pending)
        return new URLSearchParams(window.location.search).get("t") || null;
    }
}
