import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';

type MessageType = 'error' | 'success';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    type: MessageType;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, message, type }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={"center"}>{type === 'error' ? 'Error' : 'Success'}</ModalHeader>
                <ModalBody>
                    <Alert status={type === 'error' ? 'error' : 'success'}>
                        <AlertIcon />
                        <AlertTitle>{type === 'error' ? 'An error occurred !' : 'Operation successful !'}</AlertTitle>
                    </Alert>
                    <Text my={2} justifyContent={'start'}>{message} </Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MessageModal;