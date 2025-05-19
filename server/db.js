// Dummy data
const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Books' },
    { id: '3', name: 'Clothing' },
];

const products = [
    { id: 'p1', name: 'Laptop', price: 1200.00, categoryId: '1' },
    { id: 'p2', name: 'Smartphone', price: 800.00, categoryId: '1' },
    { id: 'p3', name: 'GraphQL Handbook', price: 50.00, categoryId: '2' },
    { id: 'p4', name: 'T-Shirt', price: 25.00, categoryId: '3' },
    { id: 'p5', name: 'Smartwatch', price: 300.00, categoryId: '1' },
];

module.exports = {
    categories,
    products,
};