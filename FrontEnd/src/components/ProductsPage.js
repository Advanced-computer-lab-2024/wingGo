import React, { useState, useEffect } from 'react';
import { getAllProducts, searchProductsByName, filterProductsByPrice, sortProductsByRatings } from '../APIs/touristApi';
import '../styling/ProductsPage.css'; // Import the CSS file

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [price, setPrice] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        // Fetch all products
        getAllProducts()
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);

        if (query.trim() === '') {
            // If search query is empty, fetch all products
            getAllProducts()
                .then(data => setProducts(data))
                .catch(error => console.error('Error fetching products:', error));
        } else {
            // Otherwise, search for products
            searchProductsByName(query)
                .then(data => setProducts(data))
                .catch(error => console.error('Error searching products:', error));
        }
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const applyPriceFilter = () => {
        filterProductsByPrice(price)
            .then(data => setProducts(data))
            .catch(error => console.error('Error filtering products by price:', error));
    };

    const applySort = () => {
        sortProductsByRatings()
            .then(data => setProducts(data))
            .catch(error => console.error('Error sorting products by ratings:', error));
    };

    return (
        <div className="products-page">
            <h1>Available Products</h1>
            <div className="filters">
                <h2>Filter by Price</h2>
                <input type="text" value={price} onChange={handlePriceChange} placeholder="Enter price range" />
                <button onClick={applyPriceFilter}>Apply Price Filter</button>
            </div>
            <div className="sort">
                <h2>Sort By</h2>
                <select value={sort} onChange={handleSortChange}>
                    <option value="">Select</option>
                    <option value="ratings">Ratings</option>
                </select>
                <button onClick={applySort}>Apply Sort</button>
            </div>
            <div className="search">
                <h2>Search</h2>
                <input type="text" value={search} onChange={handleSearchChange} placeholder="Search by name" />
            </div>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product">
                            <img src={product.picture} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>Price: {product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Seller: {product.seller}</p>
                            <p>Ratings: {product.ratings}</p>
                            <p>Reviews: {product.reviews.join(', ')}</p>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;