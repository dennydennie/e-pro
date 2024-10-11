import makeRequest from '@/app/services/backend';
import { User } from '@/app/types/user';
import { Button, Box, Stack, Heading, Center, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const BlueLink = styled.a`
  color: blue;
`

const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            title: "Name",
            minLength: 2,
            maxLength: 50
        },
        email: {
            type: "string",
            title: "Email",
            format: "email",
            minLength: 6,
            maxLength: 50
        },
        password: {
            type: "string",
            title: "Password",
            minLength: 6,
            maxLength: 30
        },
        phoneNumber: {
            type: "string",
            title: "Phone Number",
            minLength: 10,
            maxLength: 15
        },
        role: {
            type: "string",
            title: "Role",
            oneOf: [
                {
                    const: "admin",
                    title: "Admin"
                },
                {
                    const: "user",
                    title: "User"
                }
            ],
            default: "user"
        },
        address: {
            type: "string",
            title: "Address",
            maxLength: 100
        },
        department: {
            type: "string",
            title: "Department",
            maxLength: 50
        },
    },
    required: ["name", "email", "password", "phoneNumber"]
};

const uiSchema = {
    name: {
        "ui:placeholder": "Enter your name",
        "ui:options": {
            label: null,
        }
    },
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
    },
    phoneNumber: {
        "ui:placeholder": "Enter your phone number",
        "ui:options": {
            label: null,
        }
    },
    role: {
        "ui:widget": "select",
        "ui:options": {
            label: null,
        }
    },
    address: {
        "ui:placeholder": "Enter your address",
        "ui:options": {
            label: null,
        }
    },
    department: {
        "ui:placeholder": "Enter your department",
        "ui:options": {
            label: null,
        }
    }
};

export default function RegistrationForm() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: IChangeEvent) => {
        setLoading(true);
        setError(null);
        const { formData } = data;

        try {
            const response = await makeRequest<User>('POST', `/user`, formData);
            if (response.status === 201) {
                router.push('/auth/signin');
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
            <Stack spacing={4} align={'center'}>
                <Box
                    w={{ lg: 'sm' }}
                    mt={2}
                    p={8}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="blue.300"
                    boxShadow="md"
                    backgroundColor="white"
                >
                    <Heading
                        textAlign={"center"}
                        my={2}
                        size="lg"
                        textColor={"blue.600"}
                    >
                        E PROcure
                    </Heading>
                    <Heading
                        textAlign={"center"}
                        my={4}
                        size="md"
                        textColor={"blue.600"}
                    >
                        Register
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
                            Register
                        </Button>
                    </Form>
                    <Text textAlign="center" mt={2}>
                        Already have an account ? {" "}
                        <Link href="/auth/signin">
                            <BlueLink>Login</BlueLink>
                        </Link>
                    </Text>
                </Box>
            </Stack>
        </Center>
    );
}