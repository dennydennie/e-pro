'use client';

import React from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import PriceDetailViewComponent from "@/app/components/pages/price/PriceViewComponent";
export default function ViewPrice() {
    const router = useRouter();
    const { priceId } = router.query;

    if (!priceId) {
        return <Loading />
    }

    return (
        <PriceDetailViewComponent priceId={priceId as string} />
    );
}