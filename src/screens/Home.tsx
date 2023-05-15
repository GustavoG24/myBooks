import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { Heading, VStack, HStack, IconButton, Image, useTheme, FlatList, Center, Text } from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";

import { Filter } from "../components/Filter";
import { Button } from "../components/Button";

import Logo from "../assets/books.png";
import { Book, BookProps } from "../components/Book";
import { Loading } from "../components/Loading";
import { Alert } from "react-native";
import { dateFormat } from "../utils/FirestoreDateFormat";


export function Home() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [isLoaading, setIsLoading] = useState(false)
    const [statusSelected, setStatusSelected] = useState<'reading' | 'finished'>('reading');

    const [books, setBooks] = useState<BookProps[]>([
        // {
        //     id: '1',
        //     title: 'Harry Potter e a Pedra Filosofal',
        //     description: 'Harry Potter é um garoto órfão que vive infeliz com seus tios, os Dursleys. Ele recebe uma carta contendo um convite para ingressar em Hogwarts, uma famosa escola especializada em formar jovens bruxos. Inicialmente, Harry é impedido de ler a carta por seu tio, mas logo recebe a visita de Hagrid, o guarda-caça de Hogwarts, que chega para levá-lo até a escola. Harry adentra um mundo mágico que jamais imaginara, vivendo diversas aventuras com seus novos amigos, Rony Weasley e Hermione Granger.',
        //     when: 'Há 5 dias',
        //     status: 'finished'        
        // },
        // {
        //     id: '2',
        //     title: 'Harry Potter e a Câmara Secreta',
        //     description: 'Após as sofríveis férias na casa dos tios, Harry Potter se prepara para voltar a Hogwarts e começar seu segundo ano na escola de bruxos. Na véspera do início das aulas, a estranha criatura Dobby aparece em seu quarto e o avisa de que voltar é um erro e que algo muito ruim pode acontecer se Harry insistir em continuar os estudos de bruxaria. O garoto, no entanto, está disposto a correr o risco e se livrar do lar problemático.',
        //     when: 'hoje',
        //     status: 'reading'
        // }
    ])

    function handleNewBook() {
        navigation.navigate('new')
    }
    
    function handleOpenDetails(bookId: string) {
        navigation.navigate('details', { bookId });
    }

    function handleLogout() {
        auth()
            .signOut()
            .catch((error) => {
                console.log("error signing out: ", error);
                return Alert.alert("Erro!", "Não foi possível sair.");
            });
    }

    useEffect(() => {
        setIsLoading(true);
        const subscriber = firestore()
            .collection("books")
            .where("status", "==", statusSelected)
            .onSnapshot((snapshot) => {
                const data = snapshot.docs.map(doc => {
                    const { title, description, status, created_at } = doc.data();

                    return {
                        id: doc.id,
                        title,
                        description,
                        status,
                        when: dateFormat(created_at)
                    }
                })

                setBooks(data);
                setIsLoading(false);
            })

        return subscriber;
    }, [statusSelected])

    return(
        <VStack flex={1} bg="gray.600" py={8}>
            {/* Cabeçalho */}
            <HStack
                w="full"
                h="24"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={10}
                pb={8}
                px={6}
            >
                <Image source={Logo} resizeMode="contain" size="sm" alt="logo" />
                
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} /> }
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={7}>

                <HStack w="full" justifyContent="space-between" alignItems="center" mt={8} mb={4} pb={6}>
                    <Heading color="gray.100">
                        Meus Livros
                    </Heading>

                    <Text color="gray.200">
                        {books.length}
                    </Text>
                    
                </HStack>
                
                
                {/* Filtro */}
                <HStack space={3} mt={4} mb={8}>
                    <Filter
                        title="Lendo"
                        type="reading"
                        onPress={() =>setStatusSelected('reading')}
                        isActive={statusSelected === 'reading'}
                    />
                    <Filter
                        title="Finalizados"
                        type="finished"
                        onPress={() =>setStatusSelected('finished')}
                        isActive={statusSelected === 'finished'}
                    />
                </HStack>

                {/* Livros */}
                {isLoaading ? (
                    <Loading />
                    ) : (
                    <FlatList 
                        data={books}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Book data={item} onPress={() => handleOpenDetails(item.id)} />}
                        contentContainerStyle={{ paddingBottom: 100}}
                        ListEmptyComponent={() => (
                            <Center pt={20}>
                                <ChatTeardropText color={colors.gray[300]} size={28} />
                                <Text color={colors.gray[300]} fontSize="lg" mt={6} textAlign="center">
                                    {statusSelected === 'reading' ? 'Voce nao está lendo livros!' : 'Voce ainda nao leu um livro'}
                                </Text>
                            </Center>
                        )}
                    />
                )}

                <Button title="Novo livro" mt={6} onPress={handleNewBook} />

            </VStack>
            
            
        </VStack>
    )
}