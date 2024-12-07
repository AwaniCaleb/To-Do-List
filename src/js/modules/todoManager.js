import { ErrorHandler, UserError } from "./errorHandler.js";
import { Storage } from "./storage.js";

/**
 * TodoManager extends the Storage class to focus specifically
 * on managing the "todo-list" property within the "ac-db" object.
 */
export class TodoManager extends Storage {
    constructor() {
        super();
        this.todoKey = "todo-list"; // Property name for todos
        this.init(); // Ensure the database is initialized
    }

    /**
     * Retrieves the Todo list from the database.
     * @returns {Array} The array of Todos or an empty array if none exist.
     */
    getTodos() {
        try {
            const db = this.getDB();
            return db[this.todoKey] || []; // Default to empty array
        } catch (error) {
            ErrorHandler.handleError(error);
            // return [];
        }
    }

    /**
     * Saves the Todo list to the database.
     * @param {Array} todoList The array of Todos to save.
     */
    saveTodos(todoList) {
        try {
            const db = this.getDB();
            db[this.todoKey] = todoList; // Set the "todo-list" property
            this.saveDB(db);
            console.log("Todos saved:", todoList);
        } catch (error) {
            ErrorHandler.handleError(error);
        }
    }

    /**
     * Adds a new Todo to the list after validation.
     * @param {Object} todo The Todo object to add.
     * @throws {Error} Throws an error if validation fails.
     */
    addTodo(todo) {
        try {
            if (!this.validateTodo(todo)) {
                throw new UserError("Invalid Todo format");
            }
            const todos = this.getTodos();
            todos.push({
                id: Date.now(),
                ...todo,
                createdAt: new Date().toISOString(),
            }); // Add to the end of the list
            this.saveTodos(todos); // Save updated list
            console.log("Todo added:", todo);
        } catch (error) {
            error.message = `Error adding Todos: ${error.message}`;
            ErrorHandler.handleError(error);
        }
    }

    /**
     * Updates a Todo based on its ID.
     * @param {number} id The ID of the Todo to update.
     * @param {Object} updatedFields The fields to update (except ID).
     * @throws {UserError} Throws an error if the ID is not found or if invalid updates are attempted.
     */
    updateTodo(id, updatedFields) {
        try {
            if (!id || typeof id !== "number") {
                throw new UserError("Invalid ID provided for updating Todo.");
            }

            const todos = this.getTodos();
            let todoFound = false;

            const updatedTodos = todos.map((todo) => {
                if (todo.id === id) {
                    todoFound = true;

                    // Prevent the ID from being updated
                    const { id: _, ...otherFields } = updatedFields;

                    // Validate updated fields
                    if (Object.keys(otherFields).length === 0) {
                        throw new UserError("No valid fields provided for updating Todo.");
                    }

                    return { ...todo, ...otherFields };
                }
                return todo;
            });

            if (!todoFound) {
                throw new UserError(`Todo with ID ${id} not found.`);
            }

            this.saveTodos(updatedTodos);

            return true;
        } catch (error) {
            error.message = `Error updating Todo: ${error.message}`;
            ErrorHandler.handleError(error);

            return false;
        }
    }

    /**
     * Removes a Todo by its ID.
     * @param {number} id The ID of the Todo to remove.
     */
    removeTodo(id) {
        try {
            const todos = this.getTodos();
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            this.saveTodos(updatedTodos);
            console.log("Todo removed with ID:", id);
        } catch (error) {
            ErrorHandler.handleError(`Error removing Todo: ${error}`);
        }
    }

    /**
     * Clears all todos while keeping the "todo-list" key in the "ac-db" storage intact.
     * This is useful for resetting the list without deleting the key, ensuring the structure remains consistent.
     */
    clearTodos() {
        try {
            // Replace the "todo-list" key's value with an empty array to clear the list.
            this.saveTodos([]);

            // Log a confirmation for debugging or tracking purposes (optional, can be removed in production).
            console.log("All todos have been cleared successfully.");
        } catch (error) {
            // Handle any errors that occur during the clearing process.
            // This could include issues with accessing or modifying the local storage.
            ErrorHandler.handleError(error);
        }
    }

    /**
     * Orders Todos by a specified property.
     * @param {string} key The key to sort by ('id', 'title', 'completed', 'createdAt').
     * @param {boolean} [ascending=true] Whether to sort in ascending order.
     * @returns {Array} The sorted array of Todos.
     */
    orderTodos(key, ascending = true) {
        try {
            const todos = this.getTodos();
            return todos.sort((a, b) => {
                const comparison = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
                return ascending ? comparison : -comparison;
            });
        } catch (error) {
            ErrorHandler.handleError(`Error ordering Todos: ${error}`);
            return [];
        }
    }

    /**
     * Filters and sorts Todos based on criteria.
     * @param {Object} options The filtering and sorting options.
     * @param {string} [options.filter] The filter type: 'completed' or 'pending'. Optional.
     * @param {string} [options.sortKey] The key to sort by ('id', 'title', 'completed', 'createdAt'). Optional.
     * @param {boolean} [options.ascending=true] Whether to sort in ascending order. Default is true.
     * @returns {Array} The filtered and sorted array of Todos.
     */
    filterTodos({ filter, sortKey, ascending = true } = {}) {
        try {
            let todos = this.getTodos();

            // Apply filtering if a filter is provided
            if (filter === "completed") {
                todos = todos.filter((todo) => todo.completed === true);
            } else if (filter === "pending") {
                todos = todos.filter((todo) => todo.completed === false);
            } else if (filter && filter !== "all") {
                throw new UserError("Invalid filter type. Use 'completed', 'pending', or 'all'.");
            }

            // Apply sorting if a sortKey is provided
            if (sortKey) {
                todos = todos.sort((a, b) => {
                    const comparison = a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0;
                    return ascending ? comparison : -comparison;
                });
            }

            return todos;
        } catch (error) {
            ErrorHandler.handleError(`Error filtering Todos: ${error.message}`);
            return [];
        }
    }

    /**
     * Validates a Todo object to ensure it meets requirements.
     * @param {Object} todo The Todo object to validate.
     * @returns {boolean} Whether the Todo is valid.
     */
    validateTodo(todo) {
        return (
            todo &&
            // typeof todo.id === "number" &&
            typeof todo.title === "string" // &&
            // typeof todo.completed === "boolean" &&
            // typeof todo.createdAt === "string" // Expecting ISO date format
        );
    }
}
