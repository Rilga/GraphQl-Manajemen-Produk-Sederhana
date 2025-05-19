import React, { useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';
const graphQLClient = new GraphQLClient(endpoint);

const ADD_CATEGORY_MUTATION = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;

function CategoryForm({ onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await graphQLClient.request(ADD_CATEGORY_MUTATION, { name: categoryName });
      console.log('Category added:', data.addCategory);
      setCategoryName('');
      if (onCategoryAdded) {
        onCategoryAdded(data.addCategory);
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Add New Category</h3>
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Category'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default CategoryForm;