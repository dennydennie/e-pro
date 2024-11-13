import { Button, Box, Stack, Heading, Center, Text, useToast } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { BlueLink } from './Register';
import Image from 'next/image';

const schema = {
    type: "object",
    properties: {
        email: {
            type: "string",
            title: "Email",
            minLength: 6,
            maxLength: 50
        },
        password: {
            type: "string",
            title: "Password",
            minLength: 6,
            maxLength: 30
        },
    },
    required: ["email", "password"]
};

const uiSchema = {
    email: {
        "ui:placeholder": "Enter your email",
        "ui:options": {
            label: null,
        }
    },
    password: {
        "ui:widget": "password",
        "ui:placeholder": "Enter password",
        "ui:options": {
            label: null,
        }
    }
};

export default function LoginForm() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: IChangeEvent) => {
        setLoading(true);
        const { formData } = data;

        try {
            const result = await signIn("credentials", {
                ...formData,
                redirect: false
            });

            if (result?.error) {
                toast({
                    title: 'Login Failed',
                    description: 'Wrong email or password',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
            } else {
                toast({
                    title: 'Login Successful',
                    description: 'Redirecting to dashboard...',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });
                router.push('/');
            }
        } catch (error) {
            const errorMessage = "An unexpected error occurred. Please try again.";
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Center
            minHeight="100vh"
            bg="blue.50"
        >
            <Stack spacing={8} align={'center'}>
                <Box
                    w={{ lg: 'sm' }}
                    mt={8}
                    p={8}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="blue.300"
                    boxShadow="md"
                    backgroundColor="white"
                >
                    <Center mb={4}>
                        <Image
                            src="/img/logo.png"
                            alt="Advanced SCM Logo"
                            width={150}
                            height={150}
                            priority
                        />
                    </Center>
                    <Heading
                        textAlign={"center"}
                        my={4}
                        size="lg"
                        textColor={"blue.600"}
                    >
                        Advanced Integrated SCM
                    </Heading>
                    <Heading
                        textAlign={"center"}
                        my={4}
                        size="md"
                        textColor={"blue.600"}
                    >
                        Login
                    </Heading>
                    <Form
                        schema={schema}
                        uiSchema={uiSchema}
                        onSubmit={onSubmit}
                        validator={validator}
                    >
                        <Button
                            colorScheme='blue'
                            type='submit'
                            isLoading={loading}
                            width="full"
                            borderRadius={8}
                        >
                            Login
                        </Button>
                    </Form>
                    <Text textAlign="center" mt={4}>
                        Need an account ? {" "} <Link href="/auth/register" color="blue">
                            <BlueLink>Register</BlueLink>
                        </Link>
                    </Text>
                </Box>
            </Stack>
        </Center>
    );
}