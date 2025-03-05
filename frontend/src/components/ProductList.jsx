import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './Search';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://grokart-2.onrender.com/api/v1/products/?search=${search}`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <Search onSearch={setSearch} />
      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id}>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}
