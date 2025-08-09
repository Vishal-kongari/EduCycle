import { clearAllData } from './api';

// Function to clear all data
const clearDatabase = async () => {
    try {
        await clearAllData();
        console.log('Database cleared successfully!');
        console.log('You can now add new users and products.');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

// Execute the clear function
clearDatabase(); 