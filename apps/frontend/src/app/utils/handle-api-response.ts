type SetMessageType = React.Dispatch<React.SetStateAction<"success" | "error">>;
type SetMessage = React.Dispatch<React.SetStateAction<string>>;
type SetIsMessageModalOpen = React.Dispatch<React.SetStateAction<boolean>>;

export const handleResponse = (
    status: number,
    setMessage: SetMessage,
    setMessageType: SetMessageType,
    setIsMessageModalOpen: SetIsMessageModalOpen
) => {
    const successMessage = "The operation was successful!";
    const errorMessage = "Something went wrong!";

    if (status === 200 || status === 201) {
        setMessageType('success');
        setMessage(successMessage);
    } else {
        setMessageType('error');
        setMessage(errorMessage);
    }

    setIsMessageModalOpen(true);
};