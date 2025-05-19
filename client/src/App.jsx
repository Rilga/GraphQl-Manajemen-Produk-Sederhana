import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import CategoryForm from './components/CategoryForm';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleItemAdded = () => {
    // Increment trigger to force ProductList to refetch
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <h1>Product & Category Management</h1>
      <div className="forms-container">
        <CategoryForm onCategoryAdded={handleItemAdded} />
        <ProductForm onProductAdded={handleItemAdded} />
      </div>
      <ProductList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
