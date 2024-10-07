import { Button, Icon } from "@chakra-ui/react";

const CustomButton = ({ title, icon, action, type }: CustomButtonProps) => {
    return (
        <Button
            type={type}
            my={4}
            bg="blue.600" 
            leftIcon={<Icon as={icon} color="white" />}
            onClick={action}
            color="white"
            fontWeight="bold"
            _hover={{
                bg: "blue.500", 
                transform: 'scale(1.05)', 
            }}
            p={4} 
            h={12}
            borderRadius="md" 
            boxShadow="md" 
        >
            {title}
        </Button>
    );
}

export default CustomButton;

interface CustomButtonProps {
    title: string;
    icon: any;
    action: () => void; 
    type: "submit" | "button" | "reset" | undefined;
}