'use client';

import React from "react";
import { useRouter } from "next/router";
import CustomerDetailViewComponent from "@/app/components/pages/customer/CustomerViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewCustomer() {
    const router = useRouter();
    const { customerId } = router.query;

    if (!customerId) {
        return <Loading />
    }

    return (
        <CustomerDetailViewComponent customerId={customerId as string} />
    );
}