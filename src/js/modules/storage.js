import { StorageError } from "./errorHandler.js";

/**
 * Storage class handles interaction with the browser's localStorage.
 * This is a general-purpose class for managing a single "ac-db" object.
 */
export class Storage {
    constructor() {
        this.storageKey = "ac-db"; // Central storage object name
    }

    /**
     * Initializes the storage object if it doesn't exist.
     * @returns {object} The initialized or existing storage object.
     */
    init() {
        try {
            const data = localStorage.getItem(this.storageKey);

            if (!data) {
                const defaultData = {}; // Empty object to represent the database
                localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
                return defaultData;
            }

            return JSON.parse(data);
        } catch (error) {
            throw new StorageError("Error initializing storage:", error);
        }
    }

    /**
     * Retrieves the entire "ac-db" object from localStorage.
     * @returns {object|null} The storage object or null if there's an error.
     */
    getDB() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.init();
        } catch (error) {
            throw new StorageError(`Failed to read ${key} from local storage. ${error.message}`);
        }
    }

    /**
     * Saves the updated "ac-db" object to localStorage.
     * @param {object} data The updated database object to store.
     */
    saveDB(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            throw new StorageError(`Failed to write ${key} to local storage. ${error.message}`);
        }
    }

    /**
     * Clears the "ac-db" object from localStorage.
     */
    clearDB() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log("Storage cleared.");
        } catch (error) {
            console.error("Error clearing storage:", error);
        }
    }
}
