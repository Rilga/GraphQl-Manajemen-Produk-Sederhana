import React, { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';
const graphQLClient = new GraphQLClient(endpoint);

const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    getAllCategories {
      id
      name
    }
  }
`;

const ADD_PRODUCT_MUTATION = gql`
  mutation AddProduct($name: String!, $price: Float!, $categoryId: ID!) {
    addProduct(name: $name, price: $price, categoryId: $categoryId) {
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

function ProductForm({ onProductAdded }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await graphQLClient.request(GET_CATEGORIES_QUERY);
        setCategories(data.getAllCategories);
        if (data.getAllCategories.length > 0) {
          setSelectedCategory(data.getAllCategories[0].id); // Select first category by default
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice.trim() || !selectedCategory) {
      setError('Please fill in all fields.');
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price < 0) {
        setError('Please enter a valid price.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await graphQLClient.request(ADD_PRODUCT_MUTATION, {
        name: productName,
        price: price,
        categoryId: selectedCategory,
      });
      console.log('Product added:', data.addProduct);
      setProductName('');
      setProductPrice('');
      // Keep selected category
      if (onProductAdded) {
        onProductAdded(data.addProduct);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Add New Product</h3>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        disabled={loading}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Product Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        disabled={loading}
      />
      {categoriesLoading ? (
        <p>Loading categories...</p>
      ) : categoriesError ? (
        <p className="error">{categoriesError}</p>
      ) : (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={loading || categories.length === 0}
        >
          {categories.length === 0 && <option value="">No categories available</option>}
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      <button type="submit" disabled={loading || categories.length === 0}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ProductForm;