// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getProducts, editProduct, getPendingUsers, approvePendingUser, deletePendingUser, addProductAsAdmin } from '../api';
import '../styling/AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        sellerId: ''
    });

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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await addProductAsAdmin(newProduct);
            alert(response.message);
            setNewProduct({
                name: '',
                price: '',
                quantity: '',
                description: '',
                sellerId: ''
            });
            // Refresh the list of products
            const products = await getProducts();
            setProducts(products);
        } catch (error) {
            alert(`Failed to add product: ${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
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
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <label>
                    Name:
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} required />
                </label>
                <label>
                    Quantity:
                    <input type="number" name="quantity" value={newProduct.quantity} onChange={handleInputChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} required />
                </label>
                <label>
                    Seller ID (optional):
                    <input type="text" name="sellerId" value={newProduct.sellerId} onChange={handleInputChange} />
                </label>
                <button type="submit">Add Product</button>
            </form>
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