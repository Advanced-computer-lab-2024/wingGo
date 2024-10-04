// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getProducts, editProduct, getPendingUsers, approvePendingUser, deletePendingUser } from '../api';
import '../styling/AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setProducts(products);
        };
        fetchProducts();

        const fetchPendingUsers = async () => {
            try {
                const users = await getPendingUsers();
                setPendingUsers(users);
            } catch (error) {
                console.error('Failed to fetch pending users:', error);
                alert('Failed to fetch pending users. Please try again.');
            }
        };
        fetchPendingUsers();
    }, []);

    const handleEditProduct = async (updatedProduct) => {
        const { productId, ...productData } = updatedProduct;
        try {
            console.log('updated product id:', updatedProduct);
            console.log('Product ID:', productId); // Log the product ID
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

    const handleApproveUser = async (userId) => {
        try {
            const response = await approvePendingUser(userId);
            alert(response.message);
            const users = await getPendingUsers();
            setPendingUsers(users);
        } catch (error) {
            alert(`Failed to approve user: ${error.message}`);
        }
    };

    const handleDeclineUser = async (userId) => {
        try {
            await deletePendingUser(userId);
            alert('User was declined successfully');
            // Refresh the list of pending users
            const users = await getPendingUsers();
            setPendingUsers(users);
        } catch (error) {
            alert(`Failed to decline user: ${error.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
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
            <h2>Pending Users</h2>
            <ul>
                {pendingUsers.map(user => (
                    <li key={user._id}>
                        <span>{user.username} ({user.email}) - Role: {user.role}</span>
                        <button onClick={() => handleApproveUser(user._id)}>Approve</button>
                        <button onClick={() => handleDeclineUser(user._id)}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const EditProduct = ({ product, onClose, onSave }) => {
    const [id, setId] = useState(product.id);
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [quantity, setQuantity] = useState(product.quantity);
    const [description, setDescription] = useState(product.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = { 
            productId: product.id, 
            name, 
            price, 
            quantity, 
            description 
        };
        console.log('Updated product data:', updatedProduct);
        onSave(updatedProduct);
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