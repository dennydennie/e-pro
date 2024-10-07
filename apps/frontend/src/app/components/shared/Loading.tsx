import { VStack, Spinner, Text } from "@chakra-ui/react";

export default function Loading() {
    return (
        <VStack height={"96vh"} justifyContent="center" alignItems="center">
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="2xl" mt={4}>
                Loading...
            </Text>
        </VStack>
    );
}