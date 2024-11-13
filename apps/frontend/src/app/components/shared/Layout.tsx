import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Stack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaPowerOff, FaUser, FaUsers, FaIndustry, FaWarehouse, FaBox,FaBook, FaClipboardList, FaUserCog, FaChartBar, FaShoppingCart, FaUserTie, FaMoneyBillWave, FaBars } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import { CustomLinkType } from '@/app/types/custom-link';
import Link from 'next/link';
import { User } from '@/app/types/user';
import Image from 'next/image';

const Navbar = ({ user }:{ user: User}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sideMenu = document.getElementById('side-menu');
            const hamburgerButton = document.getElementById('hamburger-button');
            
            if (isOpen && 
                sideMenu && 
                hamburgerButton && 
                !sideMenu.contains(event.target as Node) && 
                !hamburgerButton.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleLogout = async () => {
        await signOut();
    };

    const adminLinks: CustomLinkType[] = [
        { title: 'Suppliers', basePath: '/supplier', icon: FaUserTie },
        { title: 'Raw Materials', basePath: '/raw-material', icon: FaBox },
        { title: 'Prices', basePath: '/price', icon: FaMoneyBillWave },
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
        { title: 'Suppliers', basePath: '/supplier', icon: FaUserTie },
        { title: 'Raw Materials', basePath: '/raw-material', icon: FaBox },
        { title: 'Prices', basePath: '/price', icon: FaMoneyBillWave },
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
        <>
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
                justify="space-between"
            >
                <Flex alignItems="center">
                    <Icon
                        id="hamburger-button"
                        as={FaBars}
                        boxSize={6}
                        color="white"
                        cursor="pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        mr={4}
                        _hover={{ color: 'blue.200' }}
                    />
                    <Image
                        src="/img/logo.png"
                        alt="Logo"
                        width={60}
                        height={60}
                        style={{ marginRight: '12px' }}
                    />
                    <Heading size="md" color="white">Advanced Intergrated SCM</Heading>
                </Flex>
                <Link href="#" passHref>
                    <Flex
                        alignItems="center"
                        color="white"
                        _hover={{ color: 'red' }}
                        as="a"
                        onClick={() => handleLogout()}
                    >
                        <Icon as={FaPowerOff} boxSize={5} />
                    </Flex>
                </Link>
            </Flex>

            {/* Side Menu */}
            <Box
                id="side-menu"
                position="fixed"
                left={0}
                top="60px"
                h="calc(100vh - 60px)"
                w="250px"
                bg="blue.600"
                transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
                transition="transform 0.3s ease-in-out"
                zIndex={999}
                boxShadow="2xl"
                overflowY="auto"
            >
                <Stack spacing={1} p={2}>
                    {userLinks.map((link, index) => (
                        <Link key={index} href={link.basePath} passHref>
                            <Flex
                                alignItems="center"
                                bg={router.pathname.includes(link.basePath) ? 'blue.700' : 'transparent'}
                                color="white"
                                p={1.5}
                                borderRadius="md"
                                _hover={{ 
                                    bg: 'white',
                                    transform: 'translateX(5px)',
                                    transition: 'all 0.2s',
                                    color: 'blue.500'
                                }}
                                transition="all 0.2s"
                            >
                                <Icon
                                    as={link.icon}
                                    boxSize={4}
                                    mr={2}
                                />
                                <Box as="span" fontSize="sm" fontWeight={router.pathname.includes(link.basePath) ? 'bold' : 'normal'}>
                                    {link.title}
                                </Box>
                            </Flex>
                        </Link>
                    ))}
                </Stack>
            </Box>
        </>
    );
};

const MainContent = ({ children }: any) => {
    return (
        <Box
            mt="70px"
            p={8}
            bg="blue.50"
            minHeight="calc(100vh - 70px)"
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

    if (status === "loading" || status === "unauthenticated") {
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