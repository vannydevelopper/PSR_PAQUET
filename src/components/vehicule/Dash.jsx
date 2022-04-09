import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'

import {
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    Alert,
    TouchableNativeFeedback,
    ScrollView,
    TouchableOpacity,
    Vibration
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import { Button, Icon } from 'native-base';
import { color } from 'react-native-reanimated';

const NotFoundAlert = ({ INFRACTIONS, STATUS_MESSAGE }) => {
    const [s, setSound] = useState();
    const navigation = useNavigation()
    useEffect(() => {
        (async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../../../assets/wrong.mp3')
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
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../../assets/lotties/alert-lamp.json')} autoPlay loop />
            <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>
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


const VoleeAlert = ({ INFRACTIONS, STATUS_MESSAGE }) => {
    const [s, setSound] = useState();
    const navigation = useNavigation()

    const onGoBack = async () => {
        navigation.goBack()
    }

    useEffect(() => {
        (async () => {
            const ONE_SECOND_IN_MS = 500;
            const PATTERN = [1, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS]

            const { sound } = await Audio.Sound.createAsync(
                require('../../../assets/police.mp3')
            );
            setSound(sound);
            await sound.setIsLoopingAsync(true)
            await sound.replayAsync()
            Vibration.vibrate(PATTERN, true)

            navigation.addListener('beforeRemove', async () => {
                await sound.unloadAsync()
                Vibration.cancel()
            })
            navigation.addListener('blur', async () => {
                await sound.unloadAsync()
                Vibration.cancel()
            })
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
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../../assets/lotties/alert-lamp.json')} autoPlay loop />
            <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>

            <View>
                <View style={styles.amandes}>
                    {/* <AntDesign name="creditcard" size={24} color={'red'} /> */}
                    {/* <Text style={styles.itemTitle}>Amandes</Text> */}
                </View>
                <View style={styles.infra}>
                    <Text style={styles.infra}>
                        {INFRACTIONS?.AMENDES}
                    </Text>
                </View>
            </View>
            <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                onPress={onGoBack}
                marginTop={10}
                style={{ marginLeft: 20 }}
                leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                Retourner
            </Button>
        </View>
    )
}



export default function Dash({ item }) {

    const [selected, setSelected] = useState()

    const navigation = useNavigation()
    const assurance = item.assurance
    const controle = item.controle
    const immatriculation = item.immatriculation
    const declartionVol = item.declartionVol

    const activities = [{
        title: 'Vérification plaques',
        model: 'Nissan',
        plaque: 'IDHH88',
        proprietaire: 'Bucumi Jean Marie',
        activityDate: '3/24/2022'
    }, {
        title: 'Scan permis',
        numero: 'IDHH88',
        proprietaire: 'Niyonkuru Aristide',
        activityDate: '3/24/2022'
    }, {
        title: 'Vérification permis',
        numero: 'IDHH88',
        proprietaire: 'Kabura Eric',
        activityDate: '3/23/2022'
    }, {
        title: 'Controle techniques',
        model: 'Nissan',
        plaque: 'IDHH88',
        proprietaire: 'Minani Bosco',
        activityDate: '2/22/2022'
    }]

    const factureDetails = []
    if (assurance.INFRACTIONS) {
        factureDetails.push({ ...assurance.INFRACTIONS, STATUS_MESSAGE: assurance.STATUS_MESSAGE })
    }
    if (controle.INFRACTIONS) {
        factureDetails.push({ ...controle.INFRACTIONS, STATUS_MESSAGE: controle.STATUS_MESSAGE })
    }
    if (immatriculation.INFRACTIONS) {
        factureDetails.push({ ...immatriculation.INFRACTIONS, STATUS_MESSAGE: immatriculation.STATUS_MESSAGE })
    }
    if (immatriculation.INFRACTIONS) {
        factureDetails.push(immatriculation.INFRACTIONS)
    }
    const facture = {
        payeur: `${immatriculation.NOM_PROPRIETAIRE} ${immatriculation.PRENOM_PROPRIETAIRE}`,
        factureDetails
    }


    if (declartionVol.INFRACTIONS) {
        return (
            <VoleeAlert declartionVol={declartionVol?.INFRACTIONS} STATUS_MESSAGE={declartionVol.STATUS_MESSAGE} />
        )
    }

    if (!immatriculation.NOM_PROPRIETAIRE) {
        return (
            <VoleeAlert INFRACTIONS={immatriculation.INFRACTIONS} STATUS_MESSAGE={immatriculation.STATUS_MESSAGE} />
        )
    }



    return (
        <>
            <View style={{
                width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderBottomEndRadius: 15, borderBottomStartRadius: 15
            }}>
                <Image style={{ width: 90, height: 90 }}
                    source={require('../../../assets/icon.png')}
                />
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: "#fff",
                        marginVertical: 10
                    }}
                >Police de Securité Routière </Text>

                <Text style={{
                    color: "#000",
                    fontWeight: "bold",
                    backgroundColor: "#ddd",
                    borderRadius: 20,
                    padding: 8,
                    paddingHorizontal: 15,
                }}>N° {immatriculation.NUMERO_PLAQUE}</Text>
            </View>


            <ScrollView style={{ backgroundColor: '#F0F4F5a' }}>

                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                    onPress={() => navigation.navigate('ImmatriculationsResult', { immatriculation: immatriculation })}>
                    <View style={styles.principal}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require('../../../assets/plaque.png')}
                        />
                        <View style={styles.secondaire}>
                            <View style={styles.icon}>
                                <Text style={{ ...styles.title, color: immatriculation.INFRACTIONS ? 'red' : '#000' }}>OBR</Text>
                                {immatriculation.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                    <AntDesign name="checkcircleo" size={24} color="green" />}
                            </View>
                            <Text style={{ ...styles.statusTitle, color: immatriculation.INFRACTIONS ? 'red' : 'green' }}>{immatriculation.STATUS_MESSAGE}</Text>
                            {immatriculation.INFRACTIONS && <View style={styles.principalfooter}>
                                <Text style={styles.amande}>Saisie de la voiture</Text>
                                <TouchableOpacity>
                                    <Text style={styles.bouton}>Payer</Text>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </View>
                </TouchableNativeFeedback>

                {immatriculation.NOM_PROPRIETAIRE &&
                    <>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                            onPress={() => navigation.navigate('AssurancesResult', { assurance: assurance })}>
                            <View style={styles.principal}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../../assets/assurant.png')}
                                />
                                <View style={styles.secondaire}>
                                    <View style={styles.icon}>
                                        <Text style={{ ...styles.title, color: assurance.INFRACTIONS ? 'red' : '#000' }}>Assurances</Text>
                                        {assurance.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                    </View>
                                    <Text style={{ ...styles.statusTitle, color: assurance.INFRACTIONS ? "red" : "green" }}>{assurance.STATUS_MESSAGE}</Text>
                                    {assurance.INFRACTIONS && <View style={styles.principalfooter}>
                                        <Text style={styles.amande}>{assurance.INFRACTIONS.MONTANT} Fbu</Text>
                                        {/* <TouchableOpacity>
                                            <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                    </View>}
                                </View>
                            </View>
                        </TouchableNativeFeedback>

                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                            onPress={() => navigation.navigate('ControleResult', { controle: controle })}>
                            <View style={styles.principal}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../../assets/controle.png')}
                                />
                                <View style={styles.secondaire}>
                                    <View style={styles.icon}>
                                        <Text style={{ ...styles.title, color: controle.INFRACTIONS ? 'red' : '#000' }}>Contrôle Technique</Text>
                                        {controle.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                    </View>
                                    <View style={styles.icon}>
                                        <Text style={{ ...styles.statusTitle, color: controle.INFRACTIONS ? 'red' : 'green' }}>{controle.STATUS_MESSAGE}</Text>
                                    </View>
                                    {controle.INFRACTIONS && <View style={styles.principalfooter}>
                                        <Text style={styles.amande}>{controle.INFRACTIONS.MONTANT} Fbu</Text>
                                        {/* <TouchableOpacity>
                                            <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                    </View>}
                                </View>
                            </View>
                        </TouchableNativeFeedback>

                        {declartionVol.INFRACTIONS ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                            onPress={() => navigation.navigate('PjResultatScreen', { declartionVol: declartionVol })}>
                            <View style={styles.principal}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../../assets/PNC.png')}
                                />
                                <View style={styles.secondaire}>
                                    <View style={styles.icon}>
                                        <Text style={{ ...styles.title, color: declartionVol.INFRACTIONS ? 'red' : '#000' }}>Police Judiciaire</Text>
                                        {declartionVol.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                    </View>
                                    <View>
                                        <Text style={{ ...styles.statusTitle, color: declartionVol.INFRACTIONS ? 'red' : 'green' }}>{declartionVol.STATUS_MESSAGE}</Text>
                                    </View>
                                    {declartionVol.INFRACTIONS && <View style={styles.principalfooter}>
                                        <Text style={styles.amande}>{declartionVol.INFRACTIONS.AMENDES}</Text>
                                        {/* <TouchableOpacity>
                                <Text style={styles.bouton}>Payer</Text>
                          </TouchableOpacity> */}
                                    </View>}
                                </View>
                            </View>
                        </TouchableNativeFeedback> :

                            <View style={styles.principal}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../../assets/PNC.png')}
                                />
                                <View style={styles.secondaire}>
                                    <View style={styles.icon}>
                                        <Text style={{ ...styles.title, color: declartionVol.INFRACTIONS ? 'red' : '#000' }}>Police Judiciaire</Text>
                                        {declartionVol.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                    </View>
                                    <View>
                                        <Text style={{ ...styles.statusTitle, color: declartionVol.INFRACTIONS ? 'red' : 'green' }}>{declartionVol.STATUS_MESSAGE}</Text>
                                    </View>
                                    {declartionVol.INFRACTIONS && <View style={styles.principalfooter}>
                                        <Text style={styles.amande}>{declartionVol.INFRACTIONS.AMENDES}</Text>
                                        {/* <TouchableOpacity>
                                             <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                    </View>}
                                </View>
                            </View>
                        }

                        {/* Pour afficher les details de controle physique deja fait sur ine voiture */}
                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}>
                            <View style={styles.principal}>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../../../assets/PNC.png')}
                                />
                                <View style={styles.secondaire}>
                                    <View style={styles.icon}>
                                        <Text style={styles.title}>Historiques</Text>
                                        {/* <Ionicons name="md-warning-outline" size={24} color="red" />
                                        <AntDesign name="checkcircleo" size={24} color="green" /> */}
                                    </View>
                                    <View>
                                        <Text style={styles.statusTitle}>it4668h</Text>
                                    </View>
                                    <View style={styles.principalfooter}>
                                        <Text style={styles.amande}>perte</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={styles.bouton}>
                            <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                                onPress={() => navigation.goBack()}
                                marginTop={10}
                                leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                Retourner
                            </Button>

                            <Button width={"40%"} size="lg" background={"#000"} borderRadius={20}
                                onPress={() => navigation.navigate('FactureScreen', { facture })}
                                marginTop={10}>
                                Payer
                            </Button>
                        </View>
                    </>}

            </ScrollView>
        </>


    )
}


const styles = StyleSheet.create({

    principal: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 10,
        elevation: 5
    },
    profileTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    resultItem: {
        paddingVertical: 10,
        paddingHorizontal: 10
        /* borderBottomColor: '#ddd',
        borderBottomWidth: 1 */
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemValue: {
        color: '#777',
        fontSize: 16
    },
    secondaire: {
        marginLeft: 10,
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        opacity: 0.8
    },

    principalfooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5
    },
    statusTitle: {
        fontSize: 14,
        color: "red"
    },
    amande: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#000"
    },
    // bouton: {
    //     backgroundColor: "#ddd",
    //     paddingVertical: 5,
    //     paddingHorizontal: 15,
    //     borderRadius: 8,
    //     fontWeight: "bold",
    //     opacity: 0.8
    // },
    icon: {
        flexDirection: "row",
        justifyContent: "space-between"
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
    amandes: {
        marginTop: 15,
    },
    infra: {
        // borderBottomColor: "#ddd",
        // borderBottomWidth: 2,
        alignContent: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: "bold"
    },
    bouton: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 10
    },

})
