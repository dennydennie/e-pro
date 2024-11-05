import { Button, Box, Stack, Heading, Center, Text } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { BlueLink } from './Register';

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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: IChangeEvent) => {
        setLoading(true);
        setError(null);
        const { formData } = data;

        try {
            const result = await signIn("credentials", {
                ...formData,
                redirect: false
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/');
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.");
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
                    <Heading
                        textAlign={"center"}
                        my={4}
                        size="lg"
                        textColor={"blue.600"}
                    >
                        Advanced SCM
                    </Heading>
                    <Heading
                        textAlign={"center"}
                        my={4}
                        size="md"
                        textColor={"blue.600"}
                    >
                        Login
                    </Heading>
                    {error && <Text color="red.500">{error}</Text>}
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