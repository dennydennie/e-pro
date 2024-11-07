import makeRequest from '@/app/services/backend';
import { User } from '@/app/types/user';
import { Button, Box, Stack, Heading, Center, Text, useToast } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';

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
            maxLength: 50,
            pattern: "^[a-zA-Z ]+$",
            errorMessage: {
                pattern: "Name should only contain letters and spaces"
            }
        },
        email: {
            type: "string",
            title: "Email",
            format: "email",
            minLength: 6,
            maxLength: 50,
            errorMessage: {
                format: "Please enter a valid email address"
            }
        },
        password: {
            type: "string",
            title: "Password",
            minLength: 8,
            maxLength: 30,
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            errorMessage: {
                pattern: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                minLength: "Password must be at least 8 characters long"
            }
        },
        phoneNumber: {
            type: "string",
            title: "Phone Number",
            pattern: "^\\+263[0-9]{9}$",
            errorMessage: {
                pattern: "Phone number must start with +263 followed by 9 digits"
            }
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
            minLength: 5,
            maxLength: 100,
            errorMessage: {
                minLength: "Address must be at least 5 characters long"
            }
        },
        department: {
            type: "string",
            title: "Department",
            minLength: 2,
            maxLength: 50,
            errorMessage: {
                minLength: "Department must be at least 2 characters long"
            }
        },
    },
    required: ["name", "email", "password", "phoneNumber"]
};

const uiSchema = {
    name: {
        "ui:placeholder": "Enter your name (letters only)",
        "ui:options": {
            label: null,
        }
    },
    email: {
        "ui:placeholder": "Enter your email (e.g., user@example.com)",
        "ui:options": {
            label: null,
        }
    },
    password: {
        "ui:widget": "password",
        "ui:placeholder": "Strong Password: Min 8 chars, include A-Z, a-z, 0-9, @$!%*?&",
        "ui:options": {
            label: null,
        }
    },
    phoneNumber: {
        "ui:placeholder": "+263xxxxxxxxx",
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
    const toast = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: IChangeEvent) => {
        setLoading(true);
        setError(null);
        const { formData } = data;

        try {
            const response = await makeRequest<User>('POST', `/user`, formData);
            if (response.status === 201) {
                toast({
                    title: 'Registration successful',
                    description: 'You can now login with your credentials',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
                router.push('/auth/signin');
            }
        } catch (error) {
            console.log(error);
            setError("An unexpected error occurred. Please try again.");
            toast({
                title: 'Registration failed',
                description: 'An unexpected error occurred. Please try again.',
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
                             <Center mb={2}>
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
                        my={2}
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