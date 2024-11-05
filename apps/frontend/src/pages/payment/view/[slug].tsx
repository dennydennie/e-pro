'use client';

import React from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import PaymentDetailViewComponent from "@/app/components/pages/payment/PaymentViewComponent";

export default function ViewPayment() {
    const router = useRouter();
    const { slug: paymentId } = router.query;

    if (!paymentId) {
        return <Loading />
    }

    return (
        <PaymentDetailViewComponent paymentId={paymentId as string} />
    );
}