import { VStack } from "native-base";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useState } from "react";
import { Button } from "../components/Button";
import { Alert } from "react-native";

export function Register() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);

    function hadleNewBook() {
        if (!title || !description) {
            setError(true);
            return Alert.alert("Cadastro", "Preencha todos os dados")
        }
        
        setIsLoading(true);

        firestore()
            .collection("books")
            .add({
                title,
                description,
                status: "reading",
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Sucesso", "Livro cadastrado com sucesso.");
                navigation.goBack();
            })
            .catch((error) => {
                console.log("ERROR", error);
                Alert.alert("Erro", "Erro ao cadastrar o livro");
            })
    }

    return(
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Novo livro" />

            <Input
                placeholder="Titulo"
                mt={4}
                onChangeText={setTitle}
            />
            <Input
                placeholder="Resumo"
                flex={1}
                multiline
                mt={5}
                textAlignVertical="top"
                onChangeText={setDescription}
            />

            <Button
                title="Cadastrar"
                isLoading={isLoading}
                onPress={hadleNewBook}
                mt={6}
                mb={3}
            />
        </VStack>
    )
}