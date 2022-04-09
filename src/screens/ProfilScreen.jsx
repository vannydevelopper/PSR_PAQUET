import React, { useRef, useState, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Image, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Button, Icon } from 'native-base';
import { Transition, Transitioning } from 'react-native-reanimated'
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment'
moment.updateLocale('fr', {
    calendar: {
        sameDay: "[Ajourd'hui]",
        lastDay: "[Hier]",
        nextDay: 'DD-M-YYYY',
        lastWeek: 'DD-M-YYYY',
        sameElse: 'DD-M-YYYY',
    }
})
import { useDispatch, useSelector } from 'react-redux'
import { unsetUserAction } from '../store/actions/userActions';
import { userSelector } from '../store/selectors/userSelector';

const transition = (
    <Transition.Together>
        <Transition.In type="fade" durationMs={200} />
        <Transition.Change />
        <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
)

export default function ProfilScreen() {
    const { width, height } = useWindowDimensions()
    const user = useSelector(userSelector);
    // const activities = [{
    //     title: 'Vérification plaques',
    //     model: 'Nissan',
    //     plaque: 'IDHH88',
    //     proprietaire: 'Bucumi Jean Marie',
    //     activityDate: '3/24/2022'
    // }, {
    //     title: 'Scan permis',
    //     numero: 'IDHH88',
    //     proprietaire: 'Niyonkuru Aristide',
    //     activityDate: '3/24/2022'
    // }, {
    //     title: 'Vérification permis',
    //     numero: 'IDHH88',
    //     proprietaire: 'Kabura Eric',
    //     activityDate: '3/23/2022'
    // }, {
    //     title: 'Controle techniques',
    //     model: 'Nissan',
    //     plaque: 'IDHH88',
    //     proprietaire: 'Minani Bosco',
    //     activityDate: '2/22/2022'
    // }]
    const [showProfil, setShowProfil] = useState(false)
    const [showActivities, setShowActivities] = useState(true)
    const profilTransitionRef = useRef()
    const activitiesTransitionRef = useRef()
    const dispatch = useDispatch()

    const [activites, setActivites] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://app.mediabox.bi:1997/historiques', {
                    headers: {
                        'authorization': "bearer " + user.TOKEN
                    },
                })
                const posts = await response.json()
                const freshPosts = posts
                setActivites(freshPosts)

                console.log(freshPosts, user.TOKEN)
            } catch (error) {
                console.log(error)
                // setLoadingPosts(false)
            }
        }
        fetchPosts()
    }, [])



    const Activite = ({ activite, index }) => {
        var imageSource = ''
        var title = ''
        var detailUrl
        const [detail, setDetail] = useState({})
        const [loadingDetail, setLoadingDetail] = useState(true)

        switch (activite.ID_HISTORIQUE_CATEGORIE) {
            case 1:
                title = "Contrôle plaque"
                imageSource = require('../../assets/car-plaque1.png')
                detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                break;
            case 4:
                title = 'Scan permis'
                imageSource = require('../../assets/qr-code-scan.png')
                detailUrl = `http://app.mediabox.bi:1997/permis?q=${activite.NUMERO_PERMIS}`
                break;
            case 2:
                title = 'Vérification Permis'
                imageSource = require('../../assets/badge.png')
                detailUrl = `http://app.mediabox.bi:1997/permis?q=${activite.NUMERO_PERMIS}`
                break;
            case 3:
                title = 'Controle techniques'
                imageSource = require('../../assets/mechanic.png')
                detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                break;
            default:
                imageSource = require('../../assets/car.png')
        }

        const showDate = index == 0 ? true : moment(activites[index - 1].DATE_INSERTION).date() != moment(activite.DATE_INSERTION).date()
        const ActivityDate = () => {
            return <Text style={styles.activityDate}>{moment(activite.DATE_INSERTION).calendar()}</Text>
        }
        useEffect(() => {
            (async () => {
                try {
                    const detailRes = await fetch(detailUrl)
                    const detailResponse = await detailRes.json()
                    setDetail({
                        ...detailResponse[0],
                        model: detailResponse[0]?.MARQUE_VOITURE || detailResponse[0]?.CATEGORIES,
                        numero: detailResponse[0]?.NUMERO_PLAQUE || detailResponse[0]?.NUMERO_PERMIS,
                        proprietaire: detailResponse[0]?.NOM_PROPRIETAIRE || detailResponse[0]?.NOM_PROPRIETAIRE,
                    })
                } catch (error) {
                    console.log(error, detailUrl)
                }
                setLoadingDetail(false)
            })()
        }, [])
        return (
            <View key={index.toString()}>
                {showDate && <ActivityDate />}
                <View style={styles.activity}>
                    <View style={styles.activityImage}>
                        <Image source={imageSource} style={{ width: '80%', height: '80%' }} />
                    </View>
                    {loadingDetail ? <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator animating={true} size="small" color={"black"} />
                    </View> :
                        <View style={styles.activityRightSide}>
                            <Text style={styles.activityTitle} numberOfLines={1} >{title}</Text>
                            {detail.model && <Text style={styles.carModel} numberOfLines={1} >{detail.model} | {detail.numero}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                                <Text style={styles.carOwner} numberOfLines={1} >{detail.proprietaire}</Text>
                                <Text style={{ color: '#777', alignSelf: 'flex-end' }}>{moment(activite.DATE_INSERTION).format('H:m')}</Text>
                            </View>
                        </View>}
                </View>
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={{ ...styles.container, minHeight: height - 70 }}>

                <LinearGradient
                    colors={['#000', '#000', '#000']}
                    style={styles.topHeader}
                >
                    <View style={styles.appImage}>
                        <Image source={require('../../assets/favicon.png')} style={{ width: '90%', height: '90%', marginBottom: 5 }} />
                    </View>

                </LinearGradient>

                <View style={styles.bottomContainer}>
                    <View style={styles.profilCard}>
                        <Image source={require('../../assets/police-user.png')} style={{ width: 100, height: 120, borderRadius: 15 }} />
                        <View style={styles.cardRightSide}>
                            <Text style={styles.username}>{user.NOM} {user.PRENOM}</Text>
                            <Text style={styles.userType}>police</Text>
                            <Button size="sm" background={"#000"}
                                // width={'80%'}
                                marginTop={2}
                                px={5}
                                onPress={() => dispatch(unsetUserAction())}
                                leftIcon={<Icon as={SimpleLineIcons} name="logout" size={'sm'} color="#fff" />}>
                                Déconnexion
                            </Button>
                        </View>
                    </View>

                    <Transitioning.View
                        ref={profilTransitionRef}
                        transition={transition}
                        style={styles.userProfile}>
                        <TouchableOpacity onPress={() => {
                            profilTransitionRef.current.animateNextTransition()
                            setShowProfil(t => !t)
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.profileTitle}>Profil</Text>
                                <FontAwesome5 name="angle-down" size={24} color="#777" />
                            </View>
                        </TouchableOpacity>
                        {showProfil && <View>
                            <View style={styles.profilItem}>
                                <Text style={styles.itemTitle}>Nom</Text>
                                <Text style={styles.itemValue}>
                                    {user.NOM}
                                </Text>
                            </View>
                            <View style={styles.profilItem}>
                                <Text style={styles.itemTitle}>Prénom</Text>
                                <Text style={styles.itemValue}>
                                    {user.PRENOM}
                                </Text>
                            </View>
                            <View style={styles.profilItem}>
                                <Text style={styles.itemTitle}>Lieu</Text>
                                <Text style={styles.itemValue}>
                                    {user.LIEU_EXACTE}
                                </Text>
                            </View>
                            <View style={styles.profilItem}>
                                <Text style={styles.itemTitle}>Matricule</Text>
                                <Text style={styles.itemValue}>
                                    {user.NUMERO_MATRICULE}
                                </Text>
                            </View>
                            <View style={styles.profilItem}>
                                <Text style={styles.itemTitle}>Téléphone</Text>
                                <Text style={styles.itemValue}>
                                    {user.TELEPHONE}
                                </Text>
                            </View>
                        </View>}
                    </Transitioning.View>

                    <View
                        ref={activitiesTransitionRef}
                        transition={transition}
                        style={styles.userProfile}>
                        <View onPress={() => {
                            activitiesTransitionRef.current.animateNextTransition()
                            setShowActivities(t => !t)
                            setShowProfil(false)
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.profileTitle}>Historiques</Text>
                                {/* <FontAwesome5 name="angle-down" size={24} color="#777" /> */}
                            </View>
                        </View>
                        {showActivities && <View style={styles.activities}>
                            {activites.map((activity, index) => {
                                return <Activite activite={activity} index={index} key={index} />
                            })}
                        </View>}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F7',
    },
    topHeader: {
        width: '100%',
        height: '10%',
        minHeight: 100
    },
    bottomContainer: {
        flex: 1
    },
    profilCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
        elevation: 5,
        shadowColor: '#c4c4c4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: -50
    },
    cardRightSide: {
        paddingVertical: 30,
        flex: 1,
        marginLeft: 20
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    userType: {
        color: '#777'
    },
    userProfile: {
        paddingHorizontal: 20,
        flexGrow: 1
    },
    profileTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    profilItem: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    itemValue: {
        color: '#777',
        fontSize: 16
    },

    userActivities: {
        paddingHorizontal: 20
    },
    activities: {
        marginBottom: 50
    },
    activityDate: {
        color: '#333',
        opacity: 0.6,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10
    },
    activity: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    activityImage: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F5FE',
        borderRadius: 15
    },
    activityRightSide: {
        marginLeft: 20,
        flex: 1
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 2,
        width: '90%'
    },
    carModel: {
        color: '#777',
        width: '90%'
    },
    carOwner: {
        color: '#777',
        width: '90%'
    },
    appImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "35%",
        marginTop: 5
    },
})