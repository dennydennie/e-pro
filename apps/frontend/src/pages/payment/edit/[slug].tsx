'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import PaymentForm from "@/app/components/pages/payment/PaymentFormComponent";
import { Payment } from "@/app/types/payment";

export default function EditPayment() {
    const router = useRouter();
    const { slug: paymentId } = router.query;
    const [initialData, setInitialData] = useState<Payment | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            if (paymentId) {
                try {
                    const data: Payment = (await makeRequest<Payment>('GET', `/payment/${paymentId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPayment();
    }, [paymentId]);

    if (loading) {
        return <Loading />;
    }

    return <PaymentForm initialData={initialData} />;
}