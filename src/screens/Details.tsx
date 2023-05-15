import { useState, useEffect } from "react";
import { ScrollView, VStack, useTheme, HStack } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { Header } from '../components/Header';
import { BookProps } from "../components/Book";
import { BookDetails } from "../components/BookDetails";
import { CircleWavyCheck, ClipboardText } from "phosphor-react-native";
import { Button } from "../components/Button";
import { Alert } from "react-native";
import { Loading } from "../components/Loading";
import { BookFirestoreDTO } from "../DTOs/BookDTO";
import { dateFormat } from "../utils/FirestoreDateFormat";

type RouteParams = {
    bookId: string;
}

type BookDetails = BookProps & {
    title: string;
    description: string;
    closed: string;
    when: string;
}

export function Details() {
    const [isLoading, setIsLoading] = useState(true)
    const navigation = useNavigation();
    const route = useRoute();
    const [book, setBook] = useState<BookDetails>({} as BookDetails)
    const { bookId } = route.params as RouteParams;

    const { colors } = useTheme();

    function handleFinish() {
        firestore()
            .collection("books")
            .doc(bookId)
            .update({
                status: "finished",
                finish: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert("Sucesso", "Parabens pela leitura do livro.");
                navigation.goBack();
            })
            .catch((error) => {
                console.log("Error", error);
                Alert.alert("Erro", "Ocorreu um erro ao finalizar a leitura");
            })
    }

    useEffect(() => {
        firestore()
            .collection<BookFirestoreDTO>("books")
            .doc(bookId)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const { title, description, status, created_at, finish } = doc.data();

                    const closed = finish ? dateFormat(finish) : null;
                    
                    setBook({
                        id: doc.id,
                        title,
                        description,
                        status,
                        closed,
                        when: dateFormat(created_at)
                    })
                }
                setIsLoading(false)
            });
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return(
        <VStack flex={1} bg="gray.600" p={4}>
            <Header title={"Livro"} />
            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <BookDetails 
                    title="Nome do livro"
                    icon={CircleWavyCheck} 
                    description={book.title}
                />
                <BookDetails 
                    title="Inicio da leitura"
                    icon={ClipboardText} 
                    description={book.when}
                />
                <BookDetails 
                    title="Resumo"
                    icon={ClipboardText} 
                    description={book.description}
                />
                {book.status === "finished" && (
                    <BookDetails 
                        title="Termino da leitura"
                        icon={ClipboardText} 
                        description={book.closed}
                    />
                )}
            </ScrollView>

            {book.status === "reading" && (
                <Button title="Marcar como lido" mt={6} onPress={handleFinish} />
            )}

        </VStack>
    )
}
