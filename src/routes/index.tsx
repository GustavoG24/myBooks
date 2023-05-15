import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./appRoutes";
import { Loading } from "../components/Loading";

export function Routes() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        const subscriber = auth()
            .onAuthStateChanged(response => {
                console.log("response: ", response);
                setUser(response);
                setLoading(false);
            })
    }, [])

    if (loading) {
        return <Loading />
    }

    return(
        <NavigationContainer>
            {user ? (
                <AppRoutes />
            ) : (
                <SignIn />
            )}
        </NavigationContainer>
    )
}
