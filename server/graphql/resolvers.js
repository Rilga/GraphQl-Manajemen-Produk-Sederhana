let { categories, products } = require('../db');
// Remove the uuidv4 import
// const { v4: uuidv4 } = require('uuid'); // Using uuid for unique IDs

const resolvers = {
    // Queries
    getAllProducts: () => {
        return products.map(product => ({
            ...product,
            category: categories.find(cat => cat.id === product.categoryId)
        }));
    },
    getAllCategories: () => {
        return categories.map(category => ({
            ...category,
            products: products.filter(prod => prod.categoryId === category.id)
        }));
    },
    getCategoryById: ({ id }) => {
        const category = categories.find(cat => cat.id === id);
        if (!category) return null;
        return {
            ...category,
            products: products.filter(prod => prod.categoryId === category.id)
        };
    },
    getProductById: ({ id }) => {
        const product = products.find(prod => prod.id === id);
        if (!product) return null;
        return {
            ...product,
            category: categories.find(cat => cat.id === product.categoryId)
        };
    },

    // Mutations
    addCategory: ({ name }) => {
        // Find the highest numerical ID among existing categories
        const maxCategoryId = categories.reduce((maxId, category) => {
            const idNum = parseInt(category.id);
            return !isNaN(idNum) ? Math.max(maxId, idNum) : maxId;
        }, 0);
        const newCategoryId = (maxCategoryId + 1).toString(); // Increment and convert back to string

        const newCategory = { id: newCategoryId, name };
        categories.push(newCategory);
        return newCategory;
    },
    addProduct: ({ name, price, categoryId }) => {
        const category = categories.find(cat => cat.id === categoryId); // Find the category object
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found.`);
        }

        // Find the highest numerical ID among existing products (assuming 'p' prefix)
        const maxProductId = products.reduce((maxId, product) => {
             // Extract number after 'p' and parse
            const idNum = parseInt(product.id.substring(1));
            return !isNaN(idNum) ? Math.max(maxId, idNum) : maxId;
        }, 0);
        const newProductId = 'p' + (maxProductId + 1); // Increment and add 'p' prefix

        const newProduct = {
            id: newProductId,
            name,
            price,
            categoryId, // Keep categoryId for internal data structure
            category // Include the actual category object here
        };
        products.push(newProduct);
        return newProduct; // Return the object with the category included
    },
    deleteProduct: ({ id }) => {
        const initialLength = products.length;
        products = products.filter(prod => prod.id !== id);
        if (products.length < initialLength) {
            return `Product with ID ${id} deleted successfully.`;
        } else {
            throw new Error(`Product with ID ${id} not found.`);
        }
    },
    deleteCategory: ({ id }) => {
        const initialCategoryLength = categories.length;
        const categoryToDelete = categories.find(cat => cat.id === id);

        if (!categoryToDelete) {
             throw new Error(`Category with ID ${id} not found.`);
        }

        // Remove category
        categories = categories.filter(cat => cat.id !== id);

        // Remove associated products
        const productsToDelete = products.filter(prod => prod.categoryId === id);
        products = products.filter(prod => prod.categoryId !== id);

        if (categories.length < initialCategoryLength) {
             return `Category "${categoryToDelete.name}" and ${productsToDelete.length} associated products deleted successfully.`;
        } else {
             throw new Error(`Category with ID ${id} not found.`);
        }
    },
};

module.exports = resolvers;