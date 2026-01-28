module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'Module name (singular, e.g., "track", "user"):',
        validate: (value) => {
            if (!value) return 'Module name is required';
            if (!/^[a-z]+$/.test(value)) return 'Use lowercase letters only (e.g., "track")';
            return true;
        }
    },
    {
        type: 'input',
        name: 'plural',
        message: 'Plural form (e.g., "tracks", "users"):',
        validate: (value) => {
            if (!value) return 'Plural form is required';
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'withEnum',
        message: 'Create status enum?',
        initial: true
    },
    {
        type: 'input',
        name: 'enumName',
        message: 'Enum name (e.g., "TrackStatus", "UserRole"):',
        skip: ({ withEnum }) => !withEnum
    }
];
