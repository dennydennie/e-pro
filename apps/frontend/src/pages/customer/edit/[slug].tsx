'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Customer } from "@/app/types/customer";
import CustomerForm from "@/app/components/pages/customer/CustomerFormComponent";

export default function EditCustomer() {
    const router = useRouter();
    const { slug } = router.query;
    const [initialData, setInitialData] = useState<Customer | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCustomer = async () => {
            if (slug) {
                try {
                    const data: Customer = (await makeRequest<Customer>('GET', `/customer/${slug}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching customer:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCustomer();
    }, [slug]);

    if (loading) {
        return <Loading />;
    }

    return <CustomerForm initialData={initialData} />;
}