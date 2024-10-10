import React, { useState, useEffect } from 'react';
import { 
    addProductAsSeller, 
    editProductAsSeller, 
    sortProductsByRatingsAsSeller, 
    getAllProductsAsSeller, 
    filterProductByPriceAsSeller, 
    searchProductsByNameAsSeller,
    createSellerProfile,
    updateSellerProfile,
    getSeller  // Make sure getSeller is imported
} from '../APIs/sellerApi';
import '../styling/Sellerpage.css';

const hardcodedSellerId = '67078476ab11089b0772ddf2'; // Hardcoded sellerId

const SellerPage = () => {
    // States for handling product-related functionalities
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        ratings: '', // Optional
        reviews: '', // Optional
    });
    const [productImage, setProductImage] = useState(null); // State for storing the product image
    const [productId, setProductId] = useState(''); // To store the product ID for editing
    const [isEditMode, setIsEditMode] = useState(false); // Toggle between add and edit modes
    const [sortedProducts, setSortedProducts] = useState([]); // To store sorted products
    const [allProducts, setAllProducts] = useState([]); // To store all products
    const [showAllProducts, setShowAllProducts] = useState(false); // Toggle to show or hide all products
    const [sortOrder, setSortOrder] = useState('desc'); // Track whether sorting is ascending or descending
    const [filterPrice, setFilterPrice] = useState(''); // To store the filter price
    const [filteredProducts, setFilteredProducts] = useState([]); // To store filtered products
    const [noResults, setNoResults] = useState(false); // Track if no products found for filter
    const [searchQuery, setSearchQuery] = useState(''); // To store search input for product names
    const [searchResults, setSearchResults] = useState([]); // To store search results

    // States for handling seller profile creation and update
    const [newSeller, setNewSeller] = useState({
        name: '',
        description: ''
    });
    const [updatedSeller, setUpdatedSeller] = useState({
        email: '',
        username: '',
        password: '',
        name: '',
        description: ''
    });

    // State for handling seller profile fetch
    const [sellerProfile, setSellerProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false); // State to control profile display
    const [error, setError] = useState(''); // Add error state to handle form validation

    // Fetch seller profile when component loads
    useEffect(() => {
        const fetchSellerProfile = async () => {
            try {
                const profile = await getSeller(hardcodedSellerId);
                setSellerProfile(profile);
                setUpdatedSeller(profile); // Pre-fill update form with existing data
            } catch (error) {
                setError('Failed to fetch seller profile: ' + error.message);
            }
        };
        fetchSellerProfile();
    }, []);

    // Handle input changes for seller profile creation
    const handleSellerInputChange = (e) => {
        const { name, value } = e.target;
        setNewSeller(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle input changes for seller profile update
    const handleUpdateSellerInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedSeller(prevState => ({
            ...prevState,
            [name]: value
        }));
        
    };

    // Function to create a new seller profile
    const handleCreateSellerProfile = async (e) => {
        e.preventDefault();
        console.log('rohna create');
        if (!newSeller.name && !newSeller.description) {
            setError('Either name or description is required.');
            return;
        }
    
        try {
            const response = await createSellerProfile(newSeller);
            if (response.message === 'Seller profile created and updated successfully') {
                alert('Profile created successfully');
                setNewSeller({ name: '', description: '' });
                setError('');  // Clear any error
                // Fetch the updated seller profile immediately after creation
                const updatedProfile = await getSeller(hardcodedSellerId);
                setSellerProfile(updatedProfile);
            } else {
                setError('Unexpected response: ' + response.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create profile: ' + error.message;
            setError(errorMessage);
        }
    };

    // Function to update an existing seller profile
    const handleUpdateSellerProfile = async (e) => {
        e.preventDefault();

        const updateData = {
            name: updatedSeller.name,
            description: updatedSeller.description,
        };
    
        // Only include username if it has been changed
        if (updatedSeller.username && updatedSeller.username !== sellerProfile.username) {
            updateData.username = updatedSeller.username;
        }
    
        // Only include password if it has been changed
        if (updatedSeller.password) {
            updateData.password = updatedSeller.password;
        }
    
        try {
            const response = await updateSellerProfile(updateData);
            // Check if the response includes a success message
            if (response.message === 'Profile and login credentials updated successfully') {
                alert(response.message);  // Display success message
                // Fetch the updated seller profile immediately after update
                const updatedProfile = await getSeller(hardcodedSellerId);
                setSellerProfile(updatedProfile);
                alert("Updated successfully");
            } else {
                alert('Unexpected response: ' + response.message);
            }
            setError('');  // Clear any error
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile: ' + error.message;
            setError(errorMessage);
        }
    };

    // Handle input changes for product adding/editing
    const handleProdInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle file input for the product image
    const handleFileChange = (e) => {
        setProductImage(e.target.files[0]); // Save the selected file to state
    };

    // Function to add a product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // Use FormData to handle both text and file data
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('quantity', newProduct.quantity);
        formData.append('description', newProduct.description);
        formData.append('ratings', newProduct.ratings); // Optional
        formData.append('reviews', newProduct.reviews); // Optional

        if (productImage) {
            formData.append('picture', productImage); // Only append if an image is selected
        }

        try {
            const response = await addProductAsSeller(formData); // Pass the formData object
            alert('Product added successfully');
            setNewProduct({
                name: '',
                price: '',
                quantity: '',
                description: '',
                ratings: '', // Clear optional field
                reviews: '', // Clear optional field
            });
            setProductImage(null); // Clear the image after adding the product
        } catch (error) {
            alert(`Failed to add product: ${error.message}`);
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();

        console.log('Product ID being edited:', productId); // Add this line to verify productId

        const formData = new FormData(); // Create FormData to hold product data and image
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('quantity', newProduct.quantity);
        formData.append('description', newProduct.description);
        formData.append('ratings', newProduct.ratings); // Optional
        formData.append('reviews', newProduct.reviews); // Optional

        // Append the product image if one is selected
        if (productImage) {
            formData.append('picture', productImage);
        }

        try {
            const response = await editProductAsSeller(productId, formData); // Pass FormData instead of JSON object
            alert('Product updated successfully');
            
            // Update the product in allProducts state
            setAllProducts(prevProducts => 
                prevProducts.map(product => 
                    product._id === productId ? response.product : product
                )
            );

            // If sorted or filtered, trigger the functions again to update the view
            if (sortOrder) handleSortProductsByRatings();
            if (filterPrice) handleFilterByPrice();

            // Clear form fields
            setNewProduct({
                name: '',
                price: '',
                quantity: '',
                description: '',
                ratings: '', // Clear optional field
                reviews: '', // Clear optional field
            });
            setProductImage(null); // Clear the image after adding the product
            setIsEditMode(false); // Switch back to add mode after editing
            setProductId(''); // Clear productId after editing
        } catch (error) {
            alert(`Failed to update product: ${error.message}`);
        }
    };

    // Function to fetch and display all products
    const handleFetchAllProducts = async () => {
        try {
            const products = await getAllProductsAsSeller(); // Get all products
            setAllProducts(products); // Store all products
            setShowAllProducts(true); // Set the flag to show products
        } catch (error) {
            alert(`Failed to fetch products: ${error.message}`);
        }
    };

    // Function to sort products by ratings
    const handleSortProductsByRatings = async () => {
        try {
            const products = await sortProductsByRatingsAsSeller(); // Get products
            const sorted = products.sort((a, b) => 
                sortOrder === 'asc' ? a.ratings - b.ratings : b.ratings - a.ratings
            );
            setSortedProducts(sorted); // Store sorted products
        } catch (error) {
            alert(`Failed to sort products: ${error.message}`);
        }
    };

    // Function to filter products by price
    const handleFilterByPrice = async (e) => {
        e.preventDefault();
        try {
            const products = await filterProductByPriceAsSeller(filterPrice); // Call the API with price
            if (products.length === 0) {
                setNoResults(true); // Set noResults to true if no products are found
            } else {
                setFilteredProducts(products); // Store filtered products
                setNoResults(false); // Reset noResults when products are found
            }
        } catch (error) {
            alert(`Failed to filter products: No products with such price`);
        }
    };

    // Function to search products by name
    const handleSearchProductsByName = async (e) => {
        e.preventDefault();
        try {
            const products = await searchProductsByNameAsSeller(searchQuery); // Call the API to search products by name
            if (products.length === 0) {
                setNoResults(true); // Set noResults to true if no products are found
            } else {
                setSearchResults(products); // Store search results
                setNoResults(false); // Reset noResults when products are found
            }
        } catch (error) {
            alert(`Failed to search products:   No products with such name`);
        }
    };

    // Function to open the image in a new tab
    const handleImageClick = (imagePath) => {
        const cleanPath = imagePath.startsWith('/images/') ? imagePath : `/images/${imagePath}`;
        window.open(`http://localhost:8000${cleanPath}`, '_blank');
    };

    return (
        <div className="seller-dashboard">
            <h1>Seller Dashboard</h1>

            {/* Create Seller Profile Section */}
            <h2>Complete your profile!</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
            <form onSubmit={handleCreateSellerProfile}>
                <label>
                    Name (Optional):
                    <input 
                        type="text" 
                        name="name" 
                        value={newSeller.name} 
                        onChange={handleSellerInputChange}
                    />
                </label>
                <label>
                    Description (Optional):
                    <input 
                        type="text" 
                        name="description" 
                        value={newSeller.description} 
                        onChange={handleSellerInputChange}
                    />
                </label>
                <button type="submit">Create Seller Profile</button>
            </form>

            {/* View Seller Profile Section */}
            <h2>View My Details</h2>
            <button onClick={() => setShowProfile(!showProfile)}>View My Details</button>
            {showProfile && sellerProfile && (
                <div>
                    <h3>Seller Information</h3>
                    <p><strong>Name:</strong> {sellerProfile.name}</p>
                    <p><strong>Description:</strong> {sellerProfile.description}</p>
                    <p><strong>Email:</strong> {sellerProfile.email}</p>
                    <p><strong>Username:</strong> {sellerProfile.username}</p>
                </div>
            )}

            {/* Update Seller Profile Section */}
            {sellerProfile && (
                <>
                    <h2>Update your profile!</h2>
                    <form onSubmit={handleUpdateSellerProfile}>
                        <label>
                            Email:
                            <input
                                type="text"
                                name="email"
                                value={updatedSeller.email}
                                onChange={handleUpdateSellerInputChange}
                            />
                        </label>
                        <label>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={updatedSeller.username}
                                onChange={handleUpdateSellerInputChange}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={updatedSeller.password}
                                onChange={handleUpdateSellerInputChange}
                            />
                        </label>
                        <label>
                            Name (Optional):
                            <input
                                type="text"
                                name="name"
                                value={updatedSeller.name}
                                onChange={handleUpdateSellerInputChange}
                            />
                        </label>
                        <label>
                            Description (Optional):
                            <input
                                type="text"
                                name="description"
                                value={updatedSeller.description}
                                onChange={handleUpdateSellerInputChange}
                            />
                        </label>
                        <button type="submit">Update Profile</button>
                    </form>
                </>
            )}

            {/* Add or Edit Product Section */}
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={isEditMode ? handleEditProduct : handleAddProduct} encType="multipart/form-data">
                {isEditMode && (
                    <label>
                        Product ID (for editing):
                        <input 
                            type="text" 
                            name="productId" 
                            value={productId} 
                            onChange={(e) => setProductId(e.target.value)} 
                            required 
                        />
                    </label>
                )}
                <label>
                    Name:
                    <input type="text" name="name" value={newProduct.name} onChange={handleProdInputChange}  required={!isEditMode}  />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={newProduct.price} onChange={handleProdInputChange}  required={!isEditMode}  />
                </label>
                <label>
                    Quantity:
                    <input type="number" name="quantity" value={newProduct.quantity} onChange={handleProdInputChange}  required={!isEditMode}  />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={newProduct.description} onChange={handleProdInputChange}  required={!isEditMode}  />
                </label>
                {/* <label>
                    Ratings (Optional):
                    <input type="number" name="ratings" value={newProduct.ratings} onChange={handleProdInputChange} display={!isEditMode}/>
                </label>
                <label>
                    Reviews (Optional):
                    <input type="text" name="reviews" value={newProduct.reviews} onChange={handleProdInputChange} />
                </label> */}
                <label>
                    Product Image (Optional):
                    <input type="file" name="picture" onChange={handleFileChange} accept="image/*" />
                </label>
                <button type="submit">{isEditMode ? 'Update Product' : 'Add Product'}</button>
            </form>

            {/* Button to toggle between Add and Edit mode */}
            <button onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? 'Switch to Add Mode' : 'Switch to Edit Mode'}
            </button>

            {/* Button to fetch and display all products */}
            <button className="all-products-button" onClick={handleFetchAllProducts}>
                Show All Products
            </button>

            {/* Display all products if showAllProducts is true */}
            {showAllProducts && (
                <div className="all-products">
                    <h2>All Products</h2>
                    {allProducts.length > 0 ? (
                        <ul className="product-list">
                            {allProducts.map(product => (
                                <li key={product._id} className="product-item">
                                    <h3>{product.name}</h3>
                                    {product.picture ? (
                                        <>
                                            <button 
                                                onClick={() => handleImageClick(product.picture)}
                                                style={{ padding: '5px', marginBottom: '10px', cursor: 'pointer' }}
                                            >
                                                Show Image
                                            </button>
                                        </>
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    <p><strong>Price:</strong> ${product.price}</p>
                                    <p><strong>Quantity:</strong> {product.quantity}</p>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Seller:</strong> {product.seller}</p>
                                    <p><strong>Reviews:</strong> {product.reviews}</p>
                                    <p><strong>Ratings:</strong> {product.ratings}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            )}

            {/* Button to sort products by ratings */}
            <h2>Sort Products by Ratings</h2>

            <label>
                Sort Order:
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Descending (High to Low)</option>
                    <option value="asc">Ascending (Low to High)</option>
                </select>
            </label>

            <button className="sort-button" onClick={handleSortProductsByRatings}>Sort Products</button>

            {/* Display sorted products */}
            {sortedProducts.length > 0 && (
                <div className="sorted-products">
                    <ul className="product-list">
                        {sortedProducts.map(product => (
                            <li key={product._id} className="product-item">
                                <h3>{product.name}</h3>
                                {product.picture ? (
                                    <>
                                        <button 
                                            onClick={() => handleImageClick(product.picture)}
                                            style={{ padding: '5px', marginBottom: '10px', cursor: 'pointer' }}
                                        >
                                            Show Image
                                        </button>
                                    </>
                                ) : (
                                    <p>No image available</p>
                                )}
                                <p><strong>Rating:</strong> {product.ratings}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Button to filter products by price */}
            <h2>Filter Products by Price</h2>
            <form onSubmit={handleFilterByPrice}>
                <label>
                    Enter Price:
                    <input 
                        type="number" 
                        name="filterPrice" 
                        value={filterPrice} 
                        onChange={(e) => setFilterPrice(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Filter Products</button>
            </form>

            {/* Display filtered products or no results message */}
            {noResults ? (
                <p>No products found for the specified price.</p>
            ) : (
                <div className="filtered-products">
                    <ul className="product-list">
                        {filteredProducts.map(product => (
                            <li key={product._id} className="product-item">
                                <h3>{product.name}</h3>
                                {product.picture ? (
                                    <>
                                        <button 
                                            onClick={() => handleImageClick(product.picture)}
                                            style={{ padding: '5px', marginBottom: '10px', cursor: 'pointer' }}
                                        >
                                            Show Image
                                        </button>
                                    </>
                                ) : (
                                    <p>No image available</p>
                                )}
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Button to search products by name */}
            <h2>Search Products by Name</h2>
            <form onSubmit={handleSearchProductsByName}>
                <label>
                    Enter Product Name:
                    <input 
                        type="text" 
                        name="searchQuery" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Search Products</button>
            </form>

            {/* Display search results or no results message */}
            {noResults ? (
                <p>No products found with that name.</p>
            ) : (
                <div className="search-results">
                    <ul className="product-list">
                        {searchResults.map(product => (
                            <li key={product._id} className="product-item">
                                <h3>{product.name}</h3>
                                {product.picture ? (
                                    <>
                                        <button 
                                            onClick={() => handleImageClick(product.picture)}
                                            style={{ padding: '5px', marginBottom: '10px', cursor: 'pointer' }}
                                        >
                                            Show Image
                                        </button>
                                    </>
                                ) : (
                                    <p>No image available</p>
                                )}
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SellerPage;
