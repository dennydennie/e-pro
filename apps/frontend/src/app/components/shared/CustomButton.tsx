import { Icon, IconButton } from "@chakra-ui/react";

const CustomIconButton = ({ icon, action, type }: CustomIconButtonProps) => {
    return (
        <IconButton
            aria-label="Icon button" // Provide an appropriate aria-label for accessibility
            type={type}
            my={4}
            bg="blue.600"
            icon={<Icon as={icon} color="white" />}
            onClick={action}
            color="white"
            _hover={{
                bg: "blue.500", 
                transform: 'scale(1.05)', 
            }}
            size="lg" 
            borderRadius="md" 
            boxShadow="md" 
        />
    );
}

export default CustomIconButton;

interface CustomIconButtonProps {
    icon: any;
    action: () => void; 
    type?: "submit" | "button" | "reset"; 
}