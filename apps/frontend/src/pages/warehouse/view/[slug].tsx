'use client';

import React from "react";
import { useRouter } from "next/router";
import WarehouseDetailViewComponent from "@/app/components/pages/warehouse/WarehouseViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewWarehouse() {
    const router = useRouter();
    const { slug:warehouseId } = router.query;

    if (!warehouseId) {
        return <Loading />
    }

    return (
        <WarehouseDetailViewComponent warehouseId={warehouseId as string} />
    );
}