'use client';

import React from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import RawMaterialDetailViewComponent from "@/app/components/pages/raw-material/RawMaterialViewComponent";

export default function ViewRawMaterial() {
    const router = useRouter();
    const { rawMaterialId } = router.query;

    if (!rawMaterialId) {
        return <Loading />
    }

    return (
        <RawMaterialDetailViewComponent materialId={rawMaterialId as string} />
    );
}