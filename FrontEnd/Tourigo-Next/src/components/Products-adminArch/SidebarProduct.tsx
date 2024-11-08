import {getProductData} from '@/data/prod-data';
import { Product } from '@/interFace/interFace';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';


const SidebarProduct = () => {
    
        const [products, setProducts] = useState<Product[]>([]);
      
        useEffect(() => {
          const fetchProducts = async () => {
            const data = await getProductData();
            setProducts(data || []);  // Fallback to an empty array if data is undefined
          };
          fetchProducts();
        }, []);
    return (
        <>
            <div className="sidebar-widget-post">
                {
                   products.map((item) => (
                        <div className="best-sell-post" key={item._id}>
                            <div className="best-sell-post-thumb mr-10">
                                <Link href={`/shop-details/${item._id}`}>
                                    <Image src={item.image} alt="image not found" />
                                </Link>
                            </div>
                            <div className="best-sell-post-content">
                                <h6 className="best-sell-post-title small underline">
                                    <Link href={`/shop-details/${item._id}`}>{item.name}</Link>
                                </h6>
                                <div className="best-sell-post-price">{`$${item.price}`}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default SidebarProduct;
