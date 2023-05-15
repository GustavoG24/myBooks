import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
    return(
        <NativeBaseInput
            bg="gray.700"
            h={14}
            size="md"
            fontFamily="body"
            color="white"
            placeholderTextColor="gray.300"
            _focus={{
                borderWidth: 1,
                borderColor: "yellow.500",
                bg: "gray.700"
            }}
            { ...rest}
        >

        </NativeBaseInput>
    )
}