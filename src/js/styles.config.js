export default function ({ addComponents }) {
    addComponents({
        ".task-category": {
            "@apply flex-1 border-b-2 py-3 px-4 text-sm font-medium text-center": {},
        },
        ".task-category.active": {
            "@apply text-primary border-primary": {},
        },
        ".task-category:hover": {
            "@apply text-primary border-primary": {},
        },
        ".btn-primary": {
            "@apply px-2 py-1 text-center text-white bg-primary border border-primary rounded active:text-primary-light hover:bg-transparent hover:text-primary focus:outline-none focus:ring ring-primary-light": {},
        },
        ".btn-primary-outline": {
            "@apply px-2 py-1 text-center text-primary border border-primary rounded hover:bg-primary hover:text-white active:bg-primary focus:outline-none focus:ring ring-primary-light": {},
        }
    });
};
