import { TodoManager } from '../modules/todoManager';
import { DateUtils } from "../modules/dateUtils";
import { ErrorHandler, UserError, SystemError } from "../modules/errorHandler";

export class Builder {
    constructor() {
        // Empty cuz why not lol
    }

    handleToDoInput(event) {
        if (!Builder.isEvent(event)) return;

        console.log("Inputing...");
    }

    /**
     * Handles the submission of the "New To-Do" form, including validation and adding the new to-do item.
     * @param {Event} event - The submit event triggered by the form.
     */
    handleToDoSubmit(event) {
        // Validate if the parameter is a valid Event object. If not, exit early.
        if (!Builder.isEvent(event)) return;

        // Prevent the default form submission behavior (e.g., page reload or navigation).
        event.preventDefault();

        // Retrieve the form and its input element containing the new to-do title.
        const form = event.target;
        const input = form.querySelector("input[name='new-task-inp']");
        const title = input?.value?.trim(); // Trim whitespace to avoid unintended empty or excessive spaces.

        try {
            // === VALIDATIONS === //

            // Check if the input value is empty after trimming.
            if (!title) {
                throw new UserError("Title cannot be empty."); // Throw a user-friendly error if empty.
            }

            // Enforce title length constraints (minimum 3, maximum 60 characters).
            if (title.length < 3 || title.length > 60) {
                throw new UserError("Title must be between 3 and 60 characters.");
            }

            // Prevent spamming of spaces, such as multiple consecutive spaces or leading/trailing spaces.
            if (/^\s+|\s{2,}|\s+$/.test(title)) {
                throw new UserError("Title cannot have excessive spaces.");
            }

            // === DUPLICATE CHECK === //

            // Create a new instance of TodoManager, which manages the list of all to-dos.
            const TDM = new TodoManager();

            // Check if any existing to-do has the same title (case-insensitive).
            const isDuplicate = TDM.getTodos().some(todo => todo.title.toLowerCase() === title.toLowerCase());
            if (isDuplicate) {
                throw new UserError(`A to-do with the title "${title}" already exists.`); // Inform the user of duplication.
            }

            // === CREATE NEW TO-DO === //

            // Construct a new to-do object with essential properties.
            const newToDo = {
                title, // The validated title input.
                createdAt: new Date().toISOString(), // Timestamp for the creation time.
                completed: false // Default status for new to-dos.
            };

            // Add the new to-do to the TodoManager's list of to-dos.
            TDM.addTodo(newToDo);

            // Clear the input field after successful submission.
            input.value = "";

            // A success message for debugging or feedback.
            alert(`New to-do added successfully: ${newToDo.title}`);
        } catch (error) {
            ErrorHandler.handleError(error);
        }
    }

    /**
     * Handles the deletion of a to-do item.
     * @param {Event} event - The click event triggered by the delete button.
     */
    handleToDoDelete(event) {
        // Validate if the parameter is a valid Event object. If not, exit early.
        if (!Builder.isEvent(event)) return;

        // Prevent any default browser behavior associated with the click event.
        event.preventDefault();

        try {
            // Retrieve the target element that triggered the event.
            const deleteButton = event.currentTarget;

            // Extract the to-do ID from the custom property (`todo_target`) set on the delete button.
            const toDoId = deleteButton?.todo_target;

            // If the ID is not defined or invalid, exit with an error message for debugging purposes.
            if (!toDoId) {
                throw new SystemError("Delete operation failed: Missing or invalid to-do ID.");
            }

            // Create an instance of TodoManager, which manages all to-dos.
            const TDM = new TodoManager();

            // Update the to-do storage (if persistence is implemented).
            TDM.removeTodo(toDoId)

            // Remove the corresponding DOM element for the deleted to-do.
            const todoElement = document.querySelector(`[data-id="${toDoId}"]`);
            if (todoElement) {
                todoElement.remove();
            }

            // Log a success message for debugging or feedback.
            alert("To-do deleted successfully");
        } catch (error) {
            ErrorHandler.handleError(error);
        }
    }

    /**
     * Handles the event triggered when a to-do checkbox is checked or unchecked,
     * indicating whether the to-do is completed or not.
     * @param {Event} event - The event triggered by the checkbox input.
     */
    handleToDoCheck(event) {
        // Validate if the parameter is a valid Event object. If not, exit early.
        if (!Builder.isEvent(event)) return;

        // Prevent default checkbox behavior, if necessary (e.g., for custom handling).
        event.preventDefault();

        try {
            // Retrieve the checkbox input that triggered the event.
            const checkbox = event.currentTarget;

            // Extract the to-do ID from the custom property (`todo_target`) set on the checkbox.
            const toDoId = checkbox?.todo_target;

            // If the ID is missing or invalid, log an error and exit gracefully.
            if (!toDoId) {
                throw new SystemError("Checkbox operation failed: Missing or invalid to-do ID.");
            }

            // Create an instance of TodoManager, which manages the list of todos.
            const TDM = new TodoManager();

            // Attempt to update the to-do using the updateTodo method.
            TDM.updateTodo(toDoId, { completed: checkbox.checked });

            // Log success for debugging purposes.
            alert("To-do status updated successfully");
        } catch (error) {
            ErrorHandler.handleError(error);

            // Revert the checkbox state in case of an error.
            checkbox.checked = !checkbox.checked;
        }
    }

    static isEvent(event) {
        return event instanceof Event;
    }

    static wipe(element) {
        if (!(element instanceof HTMLElement)) return;

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    static newTodoSection() {
        function form() {
            function cover() {
                let x = document.createElement("div");
                x.classList.value = "flex gap-2";

                let label = document.createElement("label");
                let input = document.createElement("input");
                let inputDescripition = document.createElement("span");

                let submit = document.createElement("button");

                label.classList.value = "relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 grow";
                label.htmlFor = input.id = input.name = "new-task-inp";

                input.classList.value = "peer w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 ring-primary";
                input.type = "text";
                input.placeholder = "New To-Do";
                input.required = true;

                input.addEventListener("input", instance.handleToDoInput.bind(instance)); // Bind input event

                formInput = input;

                inputDescripition.classList.value = "pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs";
                inputDescripition.innerText = "New To-Do";

                submit.classList.value = "btn-primary";
                submit.type = "submit";
                submit.innerText = "Add";

                label.appendChild(input);
                label.appendChild(inputDescripition);

                x.appendChild(label);
                x.appendChild(submit);

                return x;
            }

            let x = document.createElement("form");
            x.action = "./";
            x.addEventListener("submit", instance.handleToDoSubmit.bind(instance)); // Bind submit event

            formElement = x;

            x.appendChild(cover());

            return x;
        }

        const instance = new Builder(); // Create an instance of the class

        let formElement, formInput;

        let x = document.createElement("div");
        x.classList.value = "border p-4 rounded-md shadow-lg bg-white";
        x.id = "new-todo-section";

        let h = document.createElement("h2");
        h.classList.value = "text-lg font-bold mb-4";
        h.innerText = "To-Do List";

        x.appendChild(h);
        x.appendChild(form());

        return {form: formElement, section: x, input: formInput};
    }

    static newTodoElement({completed = false, data}) {
        try {
            function body() {
                let x = document.createElement("div");
                x.classList.value = "flex-grow flex justify-between items-center";

                let textCover = document.createElement("div");
                let [text, date] = [document.createElement("p"), document.createElement("p")];

                text.innerText = data.title;
                date.innerText = DateUtils.toRelativeTime(data.createdAt);

                let del = document.createElement("button");
                del.classList.value = "remove-task text-red-500 text-sm hover:underline";
                del.type = "button";
                del.todo_target = data.id;
                del.addEventListener("click",  instance.handleToDoDelete.bind(instance))
                del.innerHTML = `<i class="fa-solid fa-trash"></i>`;

                textCover.appendChild(text);
                textCover.appendChild(date);

                x.appendChild(textCover);

                if (completed) {todoDelete = del; x.appendChild(del);} else {del.remove();}

                return x;
            }

            const instance = new Builder();
            let todoCheck, todoDelete;
    
            let x = document.createElement("div");
            x.classList.value = "task flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50";

            let input = document.createElement("input");
            input.id = input.todo_target = data.id;
            input.classList.value = "task-checkbox size-4 rounded border-gray-300";
            input.type = "checkbox";

            input.addEventListener("change", instance.handleToDoCheck.bind(instance))

            if (completed) {
                input.remove()
            } else {
                todoCheck = input; x.appendChild(input);
            }

            x.appendChild(body());

            return {input: todoCheck, element: x, delete: todoDelete}

        } catch (error) {
            ErrorHandler.handleError(error);
        }
    }
}
