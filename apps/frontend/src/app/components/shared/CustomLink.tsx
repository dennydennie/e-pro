import { Flex, Box, Icon, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

const CustomLink = ({
    title,
    basePath,
    icon,
    action,
}: CustomLinkProps) => {
    const router = useRouter();
    const isActive = router.pathname.includes(basePath);

    return (
        <Box
            as="li" 
            w="full" 
            borderRadius="md" 
            transition="background 0.2s, transform 0.2s"
            _hover={{
                bg: isActive ? 'turquoise' : 'teal.500', 
                transform: 'scale(1.02)' 
            }}
            bg={isActive ? 'turquoise' : 'inherit'}
            p={4}
        >
            <Link href={basePath} passHref aria-current={isActive ? 'page' : undefined}>
                <Flex alignItems="center">
                    <Icon
                        as={icon}
                        boxSize={isActive ? 8 : 6}
                        color={isActive ? 'white' : 'gray.600'}
                    />
                    <Box ml={3} color={isActive ? "white" : "gray.800"} fontWeight={isActive ? "bold" : "normal"}>{title}</Box>
                </Flex>
            </Link>
        </Box>
    );
};

export default CustomLink;

interface CustomLinkProps {
    title: string;
    basePath: string;
    icon: IconType;
    action?: () => void;
}