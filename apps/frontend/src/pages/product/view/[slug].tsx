'use client';

import React from "react";
import { useRouter } from "next/router";
import ProductDetailViewComponent from "@/app/components/pages/product/ProductViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewProduct() {
    const router = useRouter();
    const { slug:productId } = router.query;

    if (!productId) {
        return <Loading />
    }

    return (
        <ProductDetailViewComponent productId={productId as string} />
    );
}