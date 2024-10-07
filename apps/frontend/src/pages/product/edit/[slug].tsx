'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Product } from "@/app/types/product"; 
import ProductForm from "@/app/components/pages/product/ProductFormComponent";

export default function EditProduct() {
    const router = useRouter();
    const { slug:productId } = router.query;
    const [initialData, setInitialData] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                try {
                    const data: Product = await makeRequest<Product>('GET', `/product/${productId}`);
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <Loading />;
    }

    return <ProductForm initialData={initialData} />;
}