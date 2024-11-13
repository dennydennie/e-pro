'use client';

import React from "react";
import { useRouter } from "next/router";
import SupplierDetailViewComponent from "@/app/components/pages/supplier/SupplierViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewSupplier() {
    const router = useRouter();
    const { slug: supplierId } = router.query;
    if (!supplierId) {
        return <Loading />
    }

    return (
        <SupplierDetailViewComponent supplierId={supplierId as string} />
    );
}