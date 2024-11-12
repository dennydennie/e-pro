import React from 'react';
import moment from 'moment';
import { Input, FormLabel, FormControl } from '@chakra-ui/react';

interface CustomDateWidgetProps {
    value: string;
    onChange: (value: string | null) => void;
    disabled?: boolean;
    readonly?: boolean;
    label?: string;
    id?: string;
    required?: boolean;
}

const CustomDateWidget = ({
    value,
    onChange,
    disabled,
    readonly,
    label = "Date",
    id = "date_input",
    required = false,
    ...props
}: CustomDateWidgetProps) => {
    const formattedValue = utcToLocal(value);

    return (
        <FormControl isRequired={required} isDisabled={disabled || readonly}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Input
                id={id}
                type="date"
                value={formattedValue ?? ""}
                onChange={(e) => onChange(localToUTC(e.target.value))}
                min={moment().format('YYYY-MM-DD')}
                {...props}
            />
        </FormControl>
    );
};

export function localToUTC(dateString: string) {
    if (!dateString) return null;
    const localDate = moment(dateString);
    return localDate.utc().format('YYYY-MM-DD');
};

export function utcToLocal(dateString: string) {
    if (!dateString) return null;
    const utcDate = moment.utc(dateString);
    return utcDate.local().format('YYYY-MM-DD');
};

export default CustomDateWidget;