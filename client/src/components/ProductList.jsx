import React, { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';
const graphQLClient = new GraphQLClient(endpoint);

const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts {
    getAllProducts {
      id
      name
      price
      category {
        id
        name
      }
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;


function ProductList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphQLClient.request(GET_ALL_PRODUCTS_QUERY);
      setProducts(data.getAllProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await graphQLClient.request(DELETE_PRODUCT_MUTATION, { id: productId });
        console.log(`Product ${productId} deleted.`);
        fetchProducts(); // Refresh list
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product.');
      }
    }
  };

   const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category and all its products?')) {
      try {
        const data = await graphQLClient.request(DELETE_CATEGORY_MUTATION, { id: categoryId });
        console.log(`Category ${categoryId} deleted:`, data.deleteCategory);
        fetchProducts(); // Refresh list
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category. Make sure it exists.');
      }
    }
  };


  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">{error}</p>;
  if (products.length === 0) return <p>No products found.</p>;

  // Group products by category for display
  const productsByCategory = products.reduce((acc, product) => {
      const categoryName = product.category ? product.category.name : 'Uncategorized';
      const categoryId = product.category ? product.category.id : 'uncategorized'; // Use ID if available
      if (!acc[categoryId]) {
          acc[categoryId] = { name: categoryName, id: categoryId, products: [] };
      }
      acc[categoryId].products.push(product);
      return acc;
  }, {});


  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      {Object.values(productsByCategory).map(categoryGroup => (
          <div key={categoryGroup.id} className="category-group">
              <h3>
                  {categoryGroup.name}
                  {categoryGroup.id !== 'uncategorized' && ( // Don't show delete for 'Uncategorized' group
                       <button
                           className="delete-button"
                           onClick={() => handleDeleteCategory(categoryGroup.id)}
                           title={`Delete category "${categoryGroup.name}" and its products`}
                       >
                           Delete Category
                       </button>
                  )}
              </h3>
              <ul>
                  {categoryGroup.products.map(product => (
                      <li key={product.id}>
                          {product.name} - ${product.price.toFixed(2)} ({product.category.name})
                          <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                      </li>
                  ))}
              </ul>
          </div>
      ))}
    </div>
  );
}

export default ProductList;