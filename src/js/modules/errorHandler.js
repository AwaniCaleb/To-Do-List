export class ErrorHandler {
    static handleError(error) {
        // Log errors to console (or send to an external logging service)
        console.error("Error occurred:", error);

        // Display user-friendly messages (optional)
        if (error instanceof UserError) {
            alert(error.message);
        } else if (error instanceof SystemError) {
            alert("A system error has occured", "SYS")
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    }
}

export class SystemError extends Error {
    constructor(message) {
        let x = super(message);
        this.name = "SystemError";
    }
}

export class UserError extends Error {
    constructor(message) {
        let x = super(message);
        this.name = "UserError";
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

export class StorageError extends Error {
    constructor(message) {
        super(message);
        this.name = "StorageError";
    }
}
