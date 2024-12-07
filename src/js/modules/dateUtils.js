export class DateUtils {
    /**
     * Converts an ISO 8601 date string to a human-readable relative time format.
     * @param {string} isoDate - The ISO 8601 date string to be converted.
     * @returns {string} - The human-readable relative time string.
     */
    static toRelativeTime(isoDate) {
        const now = new Date();
        const targetDate = new Date(isoDate);

        // Calculate the difference in milliseconds
        const diffMs = targetDate - now;

        // Determine if the date is in the past or future
        const isFuture = diffMs > 0;

        // Convert the difference to absolute milliseconds
        const absDiffMs = Math.abs(diffMs);

        // Conversion constants
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;
        const day = 24 * hour;
        const year = 365 * day;

        // Calculate the relative time unit and value
        let value, unit;

        if (absDiffMs < minute) {
            value = Math.floor(absDiffMs / second);
            unit = "s";
        } else if (absDiffMs < hour) {
            value = Math.floor(absDiffMs / minute);
            unit = "m";
        } else if (absDiffMs < day) {
            value = Math.floor(absDiffMs / hour);
            unit = "h";
        } else if (absDiffMs < year) {
            value = Math.floor(absDiffMs / day);
            unit = "d";
        } else {
            value = Math.floor(absDiffMs / year);
            unit = "y";
        }

        // Return the formatted string with "In" for future dates
        return isFuture ? `In ${value}${unit}` : `${value}${unit}`;
    }
}
