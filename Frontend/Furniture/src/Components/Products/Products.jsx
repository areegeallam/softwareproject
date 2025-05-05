import React, { useState, useEffect } from 'react';
import './products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <div>حدث خطأ: {error}</div>;
  }

  return (
    <div>
      {/* 👉 صندوق البحث */}
      <input
        type="text"
        placeholder="search for product..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="search-box"
      />

      <div className="products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product._id} className="product-item">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>price: {product.price} $</p>
              <img src={product.imageUrl} alt={product.name} width="200" />
              <button className="add-to-cart">add to cart</button>
            </div>
          ))
        ) : (
          <p>لا توجد منتجات تطابق البحث.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
