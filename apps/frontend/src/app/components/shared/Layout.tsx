import React, { useEffect } from 'react';
import { Box, Flex, Heading, Stack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaPowerOff, FaUser, FaUsers, FaIndustry, FaWarehouse, FaBox, FaClipboardList, FaUserCog, FaChartBar, FaShoppingCart, FaUserTie } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import Loading from './Loading';
import { User } from '@/app/types/user';
import { CustomLinkType } from '@/app/types/custom-link';
import Link from 'next/link';

const Navbar = () => {
    const router = useRouter();

    const { data, status } = useSession();
    const user: User | undefined = data?.user as User;

    useEffect(() => {
        const exemptRoutes = ['/auth/signin', '/auth/new-user'];

        if (status === "unauthenticated" && !exemptRoutes.includes(router.pathname)) {
            router.push("/auth/signin");
        }
    }, [status, router.pathname, router]);

    const handleLogout = async () => {
        await signOut();
    };

    const adminLinks: CustomLinkType[] = [
        { title: 'Customers', basePath: '/customer', icon: FaUsers },
        { title: 'Factories', basePath: '/factory', icon: FaIndustry },
        { title: 'Warehouses', basePath: '/warehouse', icon: FaWarehouse },
        { title: 'Products', basePath: '/product', icon: FaBox },
        { title: 'Stocks', basePath: '/stock', icon: FaClipboardList },
        { title: 'Users', basePath: '/user', icon: FaUserCog },
        { title: 'Stock Thresholds', basePath: '/stock-threshold', icon: FaChartBar },
        { title: 'Orders', basePath: '/order', icon: FaShoppingCart },
        { title: 'Factory Staff', basePath: '/staff', icon: FaUserTie },
    ];

    const ordinaryUserLinks: CustomLinkType[] = [
        { title: 'Customers', basePath: '/customer', icon: FaUsers },
        { title: 'Orders', basePath: '/order', icon: FaShoppingCart },
        { title: 'Stocks', basePath: '/stock', icon: FaClipboardList },
        { title: 'Products', basePath: '/product', icon: FaBox },
        { title: 'Profile', basePath: '/user', icon: FaUser },
    ];

    const userRole = user?.role;
    const userLinks = userRole === 'admin'
        ? ordinaryUserLinks
        : adminLinks;


    if (status === "loading") {
        return <Loading />;
    }

    return (
        <Flex as="nav" position="fixed" top="0" left="0" w="100%" bg="blue.600" p={6} zIndex="1000" boxShadow="md" alignItems="center">
            <Heading as="a" href="/" color="white" mr="auto">E PROcure</Heading>
            <Stack direction="row" spacing={4}>
                {userLinks.map((link, index) => (
                    <Link key={index} href={link.basePath} passHref>
                        <Flex
                            alignItems="center"
                            color={router.pathname.includes(link.basePath) ? 'white' : 'blue.200'}
                            _hover={{ color: 'white' }}
                            as="a"
                        >
                            <Icon
                                as={link.icon}
                                color={router.pathname.includes(link.basePath) ? 'white' : 'blue.200'}
                                mr={1}
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
                    >
                        <Icon as={FaPowerOff} boxSize={5} mx={2} />
                    </Flex>
                </Link>
            </Stack>
        </Flex>
    )
};

const MainContent = ({ children }: any) => {
    return (
        <Box
            mt="70px"
            p={8}
            bg="blue.50"
            minHeight="100vh"
        >
            {children}
        </Box>
    );
};

const Layout = ({ children }: any) => {
    return (
        <>
            <Navbar />
            <MainContent>
                {children}
            </MainContent>
        </>
    );
};

export default Layout;