'use client';

import FactoryDetailViewComponent from "@/app/components/pages/factory/FactoryViewComponent";
import React from "react";
import { useRouter } from "next/router"; 

export default function ViewFactory() {
    const router = useRouter(); 
    const { slug: factoryId } = router.query; 

    return (
        <FactoryDetailViewComponent factoryId={factoryId as string} />
    );
}