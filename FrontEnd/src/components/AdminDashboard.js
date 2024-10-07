// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { getProducts, editProduct, getPendingUsers, approvePendingUser, deletePendingUser, addProductAsAdmin, filterProductByPrice,
     searchProductsByName, deleteAccountById, addTourismGovernor, getAttractions, getTagsByAttractionId, addTag, deleteTag, updateTag
    , addAdmin, sortProductsByRatings, getCategories } from '../APIs/adminApi';
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
    const [filterPrice, setFilterPrice] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [accountId, setAccountId] = useState('');
    const [newGovernor, setNewGovernor] = useState({
        username: '',
        password: ''
    });
    const [attractions, setAttractions] = useState([]);
    const [attractionTags, setAttractionTags] = useState({});
    const [newTagInput, setNewTagInput] = useState('');
    const [showTagInput, setShowTagInput] = useState({});
    const [oldTagInput, setOldTagInput] = useState('');
    const [currentAction, setCurrentAction] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
    const [sortedProducts, setSortedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

        const fetchAttractions = async () => {
            try {
                const attractionsData = await getAttractions();
                setAttractions(attractionsData);
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        };
        fetchAttractions();

        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchCategories();
    }, []);

    const handleAdminInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSortProductsByRatings = async () => {
        try {
            const products = await sortProductsByRatings();
            setSortedProducts(products);
        } catch (error) {
            console.error('Error fetching sorted products:', error);
            alert('Error fetching sorted products: ' + error.message);
        }
    };
    
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await addAdmin(newAdmin.username, newAdmin.password);
            alert('Admin added successfully');
            setNewAdmin({ username: '', password: '' });
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Error adding admin: ' + error.message);
        }
    };

    const fetchTagsForAttraction = async (id) => {
        try {
            const tags = await getTagsByAttractionId(id);
            console.log('Fetched tags for attraction:', id, tags); // Debug log
            setAttractionTags(prevState => ({
                ...prevState,
                [id]: tags
            }));
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    
    const handleUpdateTag = async (id) => {
        try {
            const updatedAttraction = await updateTag(id, oldTagInput, newTagInput);
            setAttractionTags(prevState => ({
                ...prevState,
                [id]: updatedAttraction.tags
            }));
            setOldTagInput('');
            setNewTagInput('');
            setShowTagInput(prevState => ({
                ...prevState,
                [id]: false
            }));
            alert('Tag updated successfully');
        } catch (error) {
            console.error('Error updating tag:', error);
            alert('Error updating tag: ' + error.message);
        }
    };
    
    const handleOldTagChange = (e) => {
        setOldTagInput(e.target.value);
    };

    const handleShowTagInput = (id, action) => {
        setCurrentAction(action);
        setShowTagInput(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };
    
    const handleNewTagChange = (e) => {
        setNewTagInput(e.target.value);
    };
    
    const handleAddTag = async (id) => {
        try {
            const updatedAttraction = await addTag(id, newTagInput);
            setAttractionTags(prevState => ({
                ...prevState,
                [id]: updatedAttraction.tags
            }));
            setNewTagInput('');
            setShowTagInput(prevState => ({
                ...prevState,
                [id]: false
            }));
            alert('Tag added successfully');
        } catch (error) {
            console.error('Error adding tag:', error);
            alert('Error adding tag: ' + error.message);
        }
    };


const handleDeleteTag = async (id) => {
    try {
        const updatedAttraction = await deleteTag(id, newTagInput);
        setAttractionTags(prevState => ({
            ...prevState,
            [id]: updatedAttraction.tags
        }));
        setNewTagInput('');
        setShowTagInput(prevState => ({
            ...prevState,
            [id]: false
        }));
        alert('Tag deleted successfully');
    } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Error deleting tag: ' + error.message);
    }
};

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteAccountById(accountId);
            alert(response.message);
        } catch (error) {
            alert('ID is non-existent');
        }
    };

    const handleAddGovernor = async (e) => {
        e.preventDefault();
        try {
            const response = await addTourismGovernor(newGovernor);
            alert('Tourism Governor added successfully');
        } catch (error) {
            alert('An error occurred while adding the Tourism Governor');
        }
    };

    const handleEditProduct = async (updatedProduct) => {
        const { productId, ...productData } = updatedProduct;
        try {
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
            const products = await getProducts();
            setProducts(products);
        } catch (error) {
            alert(`Failed to add product: ${error.message}`);
        }
    };
    const handleGovInputChange = (e) => {
        const { name, value } = e.target;
        setNewGovernor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProdInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFilterPriceChange = (e) => {
        setFilterPrice(e.target.value);
    };

    const handleFilterProducts = async (e) => {
        e.preventDefault();
        try {
            const products = await filterProductByPrice(filterPrice);
            setFilteredProducts(products);
        } catch (error) {
            alert(`Failed to filter products: ${error.message}`);
        }
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchProducts = async (e) => {
        e.preventDefault();
        try {
            const products = await searchProductsByName(searchQuery);
            setSearchResults(products);
        } catch (error) {
            alert(`Failed to search products: ${error.message}`);
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
                        <img src={product.picture} alt={product.name} />
                        <span>Price: ${product.price}</span>
                        <span>Description: {product.description}</span>
                        <span>Quantity: {product.quantity}</span>
                        <span>Seller: {product.seller}</span>
                        <span>Rating: {product.rating}</span>
                        <span>Reviews: {product.reviews.join(', ')}</span>
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
            <h2>Sort Products by Rating</h2>
                <button onClick={handleSortProductsByRatings}>Sort Products by Ratings</button>
                {sortedProducts.length > 0 && (
                    <ul className="products-list">
                        {sortedProducts.map(product => (
                            <li key={product._id} className="product-item">
                                <span className="product-name">{product.name}</span>
                                <span className="product-rating">Rating: {product.ratings}</span>
                            </li>
                        ))}
                    </ul>
        )}
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <label>
                    Name:
                    <input type="text" name="name" value={newProduct.name} onChange={handleProdInputChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={newProduct.price} onChange={handleProdInputChange} required />
                </label>
                <label>
                    Quantity:
                    <input type="number" name="quantity" value={newProduct.quantity} onChange={handleProdInputChange} required />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={newProduct.description} onChange={handleProdInputChange} required />
                </label>
                <label>
                    Seller ID (optional):
                    <input type="text" name="sellerId" value={newProduct.sellerId} onChange={handleProdInputChange} />
                </label>
                <button type="submit">Add Product</button>
            </form>
            <h2>Search Products by Name</h2>
            <form onSubmit={handleSearchProducts}>
                <label>
                    Name:
                    <input type="text" value={searchQuery} onChange={handleSearchQueryChange} required />
                </label>
                <button type="submit">Search</button>
            </form>
            {searchResults.length > 0 && (
                <div>
                    <h2>Search Results</h2>
                    <ul>
                        {searchResults.map(product => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <img src={product.picture} alt={product.name} />
                                <span>Price: ${product.price}</span>
                                <span>Description: {product.description}</span>
                                <span>Quantity: {product.quantity}</span>
                                <span>Seller: {product.seller}</span>
                                <span>Rating: {product.rating}</span>
                                <span>Reviews: {product.reviews.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <h2>Filter Products by Price</h2>
            <form onSubmit={handleFilterProducts}>
                <label>
                    Price:
                    <input type="number" value={filterPrice} onChange={handleFilterPriceChange} required />
                </label>
                <button type="submit">Filter</button>
            </form>
            {filteredProducts.length > 0 && (
                <div>
                    <h2>Filtered Products</h2>
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <img src={product.picture} alt={product.name} />
                                <span>Price: ${product.price}</span>
                                <span>Description: {product.description}</span>
                                <span>Quantity: {product.quantity}</span>
                                <span>Seller: {product.seller}</span>
                                <span>Rating: {product.rating}</span>
                                <span>Reviews: {product.reviews.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
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
            <h2>Delete Account by ID</h2>
            <form onSubmit={handleDeleteAccount}>
                <label htmlFor="accountId">Account ID:</label>
                <input
                    type="text"
                    id="accountId"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                />
                <button type="submit">Delete Account</button>
            </form>
            <h2>Add Tourism Governor</h2>
            <form onSubmit={handleAddGovernor}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={newGovernor.username}
                    onChange={handleGovInputChange}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={newGovernor.password}
                    onChange={handleGovInputChange}
                    required
                />
                <button type="submit">Add Governor</button>
            </form>
            <h2>Attractions</h2>
        <ul className="attractions-list">
            {attractions.map(attraction => (
                <li key={attraction._id} className="attraction-item">
                    <div className="attraction-header">
                        <span className="attraction-name">{attraction.name}</span>
                        <button className="show-tags-button" onClick={() => fetchTagsForAttraction(attraction._id)}>Show Tags</button>
                        <button className="add-tag-button" onClick={() => handleShowTagInput(attraction._id, 'add')}>Add Tag</button>
                        <button className="delete-tag-button" onClick={() => handleShowTagInput(attraction._id, 'delete')}>Delete Tag</button>
                        <button className="update-tag-button" onClick={() => handleShowTagInput(attraction._id, 'update')}>Update Tag</button>
                    </div>
                    {showTagInput[attraction._id] && (
                        <div className="tag-input-container">
                            {currentAction === 'update' && (
                                <input
                                    type="text"
                                    value={oldTagInput}
                                    onChange={handleOldTagChange}
                                    placeholder="Enter old tag"
                                />
                            )}
                            <input
                                type="text"
                                value={newTagInput}
                                onChange={handleNewTagChange}
                                placeholder={currentAction === 'update' ? "Enter new tag" : "Enter tag"}
                            />
                            {currentAction === 'add' && <button onClick={() => handleAddTag(attraction._id)}>Submit Add</button>}
                            {currentAction === 'delete' && <button onClick={() => handleDeleteTag(attraction._id)}>Submit Delete</button>}
                            {currentAction === 'update' && <button onClick={() => handleUpdateTag(attraction._id)}>Submit Update</button>}
                        </div>
                    )}
                    {attractionTags[attraction._id] ? (
                        <div className="tags-container">
                            {attractionTags[attraction._id].length > 0 ? (
                                <ul className="tags-list">
                                    <li className="tag-item">
                                        {attractionTags[attraction._id].map(tag => tag).join(', ')}
                                    </li>
                                </ul>
                            ) : (
                                <p className="no-tags">No tags available</p>
                            )}
                        </div>
                    ) : (
                        <p className="loading-tags">Loading tags...</p>
                    )}
                </li>
            ))}
        </ul>
        <h2>Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={newAdmin.username}
                    onChange={handleAdminInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={newAdmin.password}
                    onChange={handleAdminInputChange}
                    required
                />
            </div>
            <button type="submit">Add Admin</button>
        </form>
        <h2>Activity Categories</h2>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>Error: {error}</p>
        ) : (
            <ul className="categories-list">
                {categories.map(category => (
                    <li key={category._id} className="category-item">
                        {category.name}
                    </li>
                ))}
            </ul>
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
        const updatedProduct = { 
            productId: product.id, 
            name, 
            price, 
            quantity, 
            description 
        };
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
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default AdminDashboard;