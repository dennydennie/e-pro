import React, { useEffect } from 'react';
import { Box, Flex, Heading, Stack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaPowerOff, FaUser, FaUsers, FaIndustry, FaWarehouse, FaBox,FaBook, FaClipboardList, FaUserCog, FaChartBar, FaShoppingCart, FaUserTie, FaMoneyBillWave } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import { CustomLinkType } from '@/app/types/custom-link';
import Link from 'next/link';
import { User } from '@/app/types/user';
import Image from 'next/image';

const Navbar = ({ user }:{ user: User}) => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
    };

    const adminLinks: CustomLinkType[] = [
        { title: 'Customers', basePath: '/customer', icon: FaUsers },
        { title: 'Factories', basePath: '/factory', icon: FaIndustry },
        { title: 'Warehouses', basePath: '/warehouse', icon: FaWarehouse },
        { title: 'Products', basePath: '/product', icon: FaBox },
        { title: 'Stocks', basePath: '/stock', icon: FaClipboardList },
        { title: 'Payments', basePath: '/payment', icon: FaMoneyBillWave },
        { title: 'Users', basePath: '/user', icon: FaUserCog },
        { title: 'Thresholds', basePath: '/threshold', icon: FaChartBar },
        { title: 'Orders', basePath: '/order', icon: FaShoppingCart },
        { title: 'Staff', basePath: '/staff', icon: FaUserTie },
        {title: 'Reports', basePath: '/report', icon: FaBook},
    ];

    const ordinaryUserLinks: CustomLinkType[] = [
        { title: 'Customers', basePath: '/customer', icon: FaUsers },
        { title: 'Orders', basePath: '/order', icon: FaShoppingCart },
        { title: 'Stocks', basePath: '/stock', icon: FaClipboardList },
        { title: 'Payments', basePath: '/payment', icon: FaMoneyBillWave },
        { title: 'Products', basePath: '/product', icon: FaBox },
        { title: 'Profile', basePath: '/user', icon: FaUser },
    ];

    const userRole = user?.role;
    const userLinks = userRole === 'admin'
        ? adminLinks
        : ordinaryUserLinks;

    if (status === "loading") {
        return <Loading />;
    }

    return (
        <Flex 
            as="nav" 
            position="fixed" 
            top="0" 
            left="0" 
            w="100%" 
            bg="blue.600" 
            px={4} 
            h="60px" 
            zIndex="1000" 
            boxShadow="md" 
            alignItems="center"
        >
            <Flex alignItems="center" mr={4}>
                <Image
                    src="/img/logo.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    style={{ marginRight: '8px' }}
                />
                <Heading size="md" color="white">Advanced SCM</Heading>
            </Flex>
            <Stack direction="row" spacing={4} alignItems="center">
                {userLinks.map((link, index) => (
                    <Link key={index} href={link.basePath} passHref>
                        <Flex
                            alignItems="center"
                            color={router.pathname.includes(link.basePath) ? 'white' : 'blue.200'}
                            _hover={{ color: 'white' }}
                            as="a"
                            fontSize="sm"
                        >
                            <Icon
                                as={link.icon}
                                color={router.pathname.includes(link.basePath) ? 'white' : 'blue.200'}
                                mr={1}
                                boxSize={4}
                            />
                            <Box
                                as="span"
                                color={router.pathname.includes(link.basePath) ? 'white' : 'blue.200'}
                                fontWeight={router.pathname.includes(link.basePath) ? 'bold' : 'normal'}
                            >
                                {link.title}
                            </Box>
                        </Flex>
                    </Link>
                ))}
                <Link href="#" passHref>
                    <Flex
                        alignItems="center"
                        color="white"
                        _hover={{ color: 'red' }}
                        as="a"
                        onClick={() => handleLogout()}
                        ml={2}
                        mr={2}
                    >
                        <Icon as={FaPowerOff} boxSize={4} />
                    </Flex>
                </Link>
            </Stack>
        </Flex>
    )
};

const MainContent = ({ children }: any) => {
    return (
        <Box
            mt="20px"
            p={8}
            bg="blue.50"
            minHeight="100vh"
        >
            {children}
        </Box>
    );
};

const Layout = ({ children }: any) => {
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const exemptRoutes = ['/auth/signin', '/auth/new-user'];

        if (status === "unauthenticated" && !exemptRoutes.includes(router.pathname)) {
            router.replace('/auth/signin');
        }
    }, [status, router]);

    if (status === "loading") {
        return <Loading />;
    }

    return (
        <>
            <Navbar user={data?.user! as User} />
            <MainContent>
                {children}
            </MainContent>
        </>
    );
};

export default Layout;