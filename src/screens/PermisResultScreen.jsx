import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Image, Switch, Vibration } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Button, Icon } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

const NotFoundAlert = ({ INFRACTIONS, STATUS_MESSAGE, factPermis }) => {
    // console.log(INFRACTIONS)
    const [s, setSound] = useState();
    const navigation = useNavigation()
    useEffect(() => {
        (async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/wrong.mp3')
            );
            setSound(sound);
            await sound.playAsync()
            Vibration.vibrate(1000, true)
        })()

        return async () => {
            if (s) {
                s.unloadAsync();
                Vibration.cancel()
            }
        }
    }, [])
    return (
        <View style={styles.errorContainer}>
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/alert-lamp.json')} autoPlay loop />
            <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>
            <View>
                <View style={styles.amandes}>
                    <AntDesign name="creditcard" size={24} color={'red'} />
                    <Text style={styles.itemTitle}>Amandes</Text>
                </View>
                <View style={styles.infra}>
                    <Text style={styles.itemValue}>
                        {INFRACTIONS.MONTANT} Fbu
                    </Text>

                    <Button width={"40%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.navigate('FactureScreen', { facture: factPermis })}
                        marginTop={-3}>
                        Payer
                    </Button>
                </View>
            </View>

            {/* <Text style={styles.errorTitle}>{INFRACTIONS.MONTANT}</Text> */}
            <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                onPress={() => navigation.goBack()}
                marginTop={10}
                style={{ marginLeft: 20 }}
                leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                Retourner
            </Button>
        </View>
    )
}


export default function PermisResultScreen() {
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const route = useRoute()
    const { numero, permis } = route.params
    const [s, setSound] = useState();

    console.log(permis)

    // var datep = permis.DATE_DELIVER.split('T')
    // var dateExp = permis.DATE_EXPIRATION.split('T')
    // var dateN = permis.DATE_NAISSANCE.split('T')
    const factureDetails = []
    if (permis.INFRACTIONS) {
        factureDetails.push({ ...permis.INFRACTIONS, STATUS_MESSAGE: permis.STATUS_MESSAGE })
    }
    const factPermis = {
        payeur: `${permis.NOM_PROPRIETAIRE}`,
        factureDetails
    }

    useEffect(() => {
        (async () => {
            if (numero == 4) {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/wrong.mp3')
                );
                setSound(sound);
                await sound.playAsync()
                Vibration.vibrate(1000, true)
            }
        })()

        return async () => {
            if (s) {
                s.unloadAsync();
                Vibration.cancel()
            }
        }
    }, [])

    if (permis.INFRACTIONS && !permis.NUMERO_PERMIS) {
        return <NotFoundAlert INFRACTIONS={permis.INFRACTIONS} STATUS_MESSAGE={permis.STATUS_MESSAGE}
            factPermis={factPermis}
        />
    }

    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 70 }}>
                <View style={styles.header}>
                    <Image source={require('../../assets/badge-1.png')} style={{ height: 100 }} />
                </View>
                <View style={styles.resultContent}>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <Ionicons name="md-person-outline" size={30} color={'#58A0EB'} />
                            <Text style={styles.itemTitle}>Proprietaire</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.NOM_PROPRIETAIRE}
                        </Text>
                    </View>


                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="idcard" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Numéro du permis</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.NUMERO_PERMIS}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            {/* <AntDesign name="calendar" size={24} color= "#58A0EB" /> */}
                            <AntDesign name="creditcard" size={24} color="#58A0EB" />
                            <Text style={{ ...styles.itemTitle, color: numero == 4 ? '#000' : '#000' }}>Categorie</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.CATEGORIES}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={numero == 4 ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: numero == 4 ? 'red' : '#333' }}>Date Naissance</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: numero == 4 ? 'red' : '#333' }}>
                            {permis.DATE_NAISSANCE}
                            {/* {dateN[0]} */}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Date Debut</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: permis.INFRACTIONS ? 'red' : '#333' }}>
                            {permis.DATE_DELIVER}
                            {/* {datep[0]} */}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Date de validité</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: permis.INFRACTIONS ? 'red' : '#333' }}>
                            {permis.DATE_EXPIRATION}
                            {/* {dateExp[0]} */}
                        </Text>
                    </View>


                    {permis.INFRACTIONS && <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            {/* <AntDesign name="calendar" size={24} color="#58A0EB" /> */}
                            <AntDesign name="creditcard" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Amandes</Text>
                        </View>
                        <View >
                            <Text style={styles.itemValue}>
                                {permis.INFRACTIONS.MONTANT} Fbu
                            </Text>
                        </View>
                    </View>}


                    {/* <View style={styles.resultItem}> */}
                    {/* <View style={styles.itemLeft}> */}
                    {/* <AntDesign name="calendar" size={24} color="#58A0EB" /> */}
                    {/* <AntDesign name="creditcard" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Amandes</Text> */}
                    {/* </View> */}
                    {/* <View > */}
                    {/* <Text style={styles.itemValue}>
                                {permis.INFRACTIONS.MONTANT} Fbu
                            </Text> */}
                    {/* </View> */}
                    {/* </View> */}


                </View>
                {/* Autres controles pour les check */}
                <View style={styles.principal}>
                    <View style={styles.secondaire}>
                        <View style={styles.principalfooter}>
                            <View style={styles.switch}>
                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 15, opacity: 0.8 }}>bonjour</Text>
                                </View>
                                <Switch />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bouton}>
                    <Button width={"30%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.goBack()}
                        marginTop={10}>
                        ok
                    </Button>

                    {permis.INFRACTIONS && <Button width={"30%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.navigate('FactureScreen', { facture: factPermis })}
                        marginTop={10}>
                        Payer
                    </Button>}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F7',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        opacity: 0.6
    },
    numero: {
        fontSize: 16
    },
    resultContent: {
        width: '100%',
    },
    resultItem: {
        paddingVertical: 10,
        /* borderBottomColor: '#ddd',
        borderBottomWidth: 1 */
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        opacity: 0.8,
        marginLeft: 10
    },
    itemValue: {
        color: '#777',
        fontSize: 16
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F3F7F7',
    },
    errorTitle: {
        fontSize: 25,
        color: 'red',
        fontWeight: 'bold',
        opacity: 0.8
    },
    bouton: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    amandes: {
        flexDirection: "row",
        marginRight: "60%",
        marginTop: 15,
    },
    infra: {
        flexDirection: "row",
        justifyContent: "space-between",
        // borderBottomColor: "#ddd",
        // borderBottomWidth: 2,
        justifyContent: "space-between"
    },
    principal: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 10,
        elevation: 5,


    },
    secondaire: {
        marginLeft: 10,
        flex: 1
    },
    principalfooter: {
        // flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5
    },
    switch: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
})