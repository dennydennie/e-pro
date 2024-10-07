'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { User } from "@/app/types/user";
import UserForm from "@/app/components/pages/user/UserFormComponent";

export default function EditUser() {
    const router = useRouter();
    const { slug:userId } = router.query;
    const [initialData, setInitialData] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                try {
                    const data: User = await makeRequest<User>('GET', `/user/${userId}`);
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return <Loading />;
    }

    return <UserForm initialData={initialData} />;
}