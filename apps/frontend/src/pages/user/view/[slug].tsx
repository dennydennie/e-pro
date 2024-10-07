'use client';

import React from "react";
import { useRouter } from "next/router";
import UserDetailViewComponent from "@/app/components/pages/user/UserViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewUser() {
    const router = useRouter();
    const { slug:userId } = router.query;

    if (!userId) {
        return <Loading />
    }

    return (
        <UserDetailViewComponent userId={userId as string} />
    );
}