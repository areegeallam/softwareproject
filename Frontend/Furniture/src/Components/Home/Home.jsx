import React, { useState, useEffect } from 'react';
import img1 from "./../../assets/headerChair.png";
import { NavLink } from 'react-router-dom';
import Products from '../Products/Products';
import light from './../../assets/light-bulb_8534606.png';
import InteriorDesign from './../../assets/interior-design_2400622.png';
import OutdoorDesign from './../../assets/painting_2821314.png';
import { CiTimer } from "react-icons/ci";
import { FiDollarSign } from "react-icons/fi";
import { CiShoppingBasket } from "react-icons/ci";
import { MdOutlinePolicy } from "react-icons/md";

export default function Home() {
  const [products, setProducts] = useState([]);

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
      })
      .catch(err => {
        console.error('Error fetching products:', err.message);
      });
  }, []);

  // تحديد 4 منتجات فقط لعرضها في Home
  const displayedProducts = products.slice(0, 4);

  return (
    <>
      {/* Home Section */}
      <div className="Home main_color min-h-100">
        <div className="lg:flex">
          <div className="w-full md:w-1/2 lg:mt-10 p-10 lg:ms-10">
            <h1 className='mt-10'>Modern Interior Design Studio</h1>
            <p className='mt-5'>
              Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. 
              Aliquam vulputate velit imperdiet dolor tempor tristique.
            </p>
            <div className="flex mt-10">
              <NavLink to="/product" className="HomeShop">Shop Now</NavLink>
            </div>
          </div>
          <div className="Home_chair md:w-1/2 lg:me-40 w-full">
            <img src={img1} alt="Home chair" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="main_color2 py-10">
        <h1 className="text-center text-2xl font-bold mb-5">Best Sellers This Week</h1>
        <div className="products-list">
          {displayedProducts.map(product => (
            <div key={product._id} className="product-item">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: {product.price} $</p>
              <img src={product.imageUrl} alt={product.name} width="200" />
              <button className="add-to-cart">Add to cart</button>
            </div>
          ))}
        </div>
        <div className="p-4">
          <NavLink to='/product' className='btn_product block ms-auto'>All Products 🔜</NavLink>
        </div>
      </div>

      {/* Why You Choose Us Section */}
      <div className="main_color2">
        <h1 className='text-center text-2xl font-bold pt-10'>Why You Choose Us</h1>
        <div className="flex flex-wrap mt-10">
          {/* ... باقي الكود كما هو */}
        </div>
      </div>

      {/* Our Services Section */}
      <div className="main_color2">
        <div className="px-10 pb-5">
          <h1 className='text-center text-4xl font-bold p-10'>Our Services</h1>
          {/* ... باقي الكود كما هو */}
        </div>
      </div>
    </>
  );
}
