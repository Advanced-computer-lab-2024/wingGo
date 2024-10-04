// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getProducts, editProduct } from '../api';
import '../styling/AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setProducts(products);
        };
        fetchProducts();
    }, []);

    const handleEditProduct = async (productId, productData) => {
        try {
            console.log('Sending data to backend:', productData);
            await editProduct(productId, productData);
            setSelectedProduct(null);
            const updatedProducts = await getProducts();
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Failed to edit product:', error.response ? error.response.data : error.message);
            alert('Failed to edit product. Please try again.');
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <span>{product.name}</span>
                        <button onClick={() => setSelectedProduct(product)}>Edit</button>
                    </li>
                ))}
            </ul>
            {selectedProduct && (
                <EditProduct
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onSave={handleEditProduct}
                />
            )}
        </div>
    );
};

const EditProduct = ({ product, onClose, onSave }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [quantity, setQuantity] = useState(product.quantity);
    const [description, setDescription] = useState(product.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = { name, price, quantity, description };
        console.log('Updated product data:', updatedProduct);
        onSave(product._id, updatedProduct);
    };

    return (
        <div className="edit-product">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
                </label>
                <label>
                    Quantity:
                    <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
                </label>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};


export default AdminDashboard;