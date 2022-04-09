import { Button, Input } from 'native-base'
import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { userSelector } from '../store/selectors/userSelector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { Portal } from 'react-native-portalize'
import Facture from '../components/app/Facture'

export default function FactureScreen() {
    const payModalizeRef = useRef()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const route = useRoute()
    const user = useSelector(userSelector);

    const { facture } = route.params;

    const openPay = () => {
        payModalizeRef.current.open()
    }

    //Unitialisation de paiyement sur un Api Ecocash
    const payerFacture = async () => {
        var url = "http://app.mediabox.bi/api_ussd_php/Api_client_ecocash";
        setLoading(true);
        try {
            const econnetResponse = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    VENDEUR_PHONE: "79839653",
                    AMOUNT: "100",
                    CLIENT_PHONE: "71500003",
                    INSTANCE_TOKEN: "1"
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "bearer " + user.TOKEN
                }
            })
            const ecoData = await econnetResponse.json()
            // console.log(ecoData)
            alert(ecoData.message)
            navigation.navigate('Home')
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const PaymentModalize = () => {
        const [numero, setNumero] = useState('')
        return (
            <View style={styles.payContainer}>
                <Image source={require('../../assets/ecocash.png')} style={{ height: 40, width: '50%' }} />
                <Input
                    value={numero.toString()}
                    onChangeText={n => setNumero(n)}
                    placeholder='Numéro ecocash'
                    width={"full"} size="lg" my={5} keyboardType="number-pad" />
                <View style={styles.actions}>
                    <Button isDisabled={numero == ''} borderRadius={10} size="lg" isLoading={loading} onPress={payerFacture} background="#000">Payer</Button>
                </View>
            </View>
        )
    }
    return (
        <>
            <ScrollView>
                <Facture openPay={openPay} facture={facture} />
            </ScrollView>
            {/* <Portal> */}
            <Modalize ref={payModalizeRef} adjustToContentHeight>
                <PaymentModalize />
            </Modalize>
            {/* </Portal> */}
        </>
    )
}

const styles = StyleSheet.create({
    payContainer: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        width: '100%'
    }
})