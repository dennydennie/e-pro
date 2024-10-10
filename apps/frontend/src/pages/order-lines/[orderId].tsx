'use client';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import OrderLineListComponent from '@/app/components/pages/order-line/OrderLineListComponent';

const OrderLinesPage: React.FC = () => {
    const router = useRouter();
    const { orderId } = router.query;

    useEffect(() => {
        if (!orderId) {
            router.push('/order');
        }
    }, [orderId, router]);

    return (
        <>
            {orderId && <OrderLineListComponent orderId={orderId as string} />}
        </>
    );
};

export default OrderLinesPage;