import React from 'react';
import { Alert, Platform, TouchableOpacity, AsyncStorage, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Icon } from 'expo';
import { db } from '../config';
import { NavigationActions } from 'react-navigation';

deleteItem = ( key, navigation ) =>{
  Alert.alert("Are you sure you want to delete this team?", "It will be unretrievable unless it is already in the database.",
  [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => {}
    },
    {
      text: 'OK', 
      onPress: () => {
        AsyncStorage.removeItem(key);
        navigation.navigate('LocalInfo');
      }
    }
  ])
}

addTeam = (info) => {  
  Alert.alert("Upload this team to database?", "This will only work if you have internet.",
  [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => {}
    },
    {
      text: 'OK', 
      onPress: () => {
        var habLinePoints = (info.crossedBaseline === 'yes' ? "3" : "0")
        var habitatPoints = (info.habitatHeight < 3 ? `${parseInt(info.habitatHeight)*3}` : "12")
        db.ref(`teams/${info.teamNum}`).set({
          "info":{
          teamNum: `${info.teamNum}`,
          startLevel: `${info.startLevel}`,
          gotOffHabitat: `${info.gotOffHabitat}`,
          crossedBaseline: `${info.crossedBaseline}`,
          usedVision: `${info.usedVision}`,
          numCargoInCShipAuton: `${info.numCargoInCShipAuton}`,
          numCargoInRShipAuton: `${info.numCargoInRShipAuton}`,
          numHPanelsInCShipAuton: `${info.numHPanelsInCShipAuton}`,
          numHPanelsInRShipAuton: `${info.numHPanelsInRShipAuton}`,
          numCargoInCShipTele: `${info.numCargoInCShipTele}`,
          numCargoInRShipTele: `${info.numCargoInRShipTele}`,
          numHPanelsInCShipTele: `${info.numHPanelsInCShipTele}`,
          numHPanelsInRShipTele: `${info.numHPanelsInRShipTele}`,
          habitatHeight: `${info.habitatHeight}`,
          extraComments: `${info.extraComments}`,
          totalPoints: `${parseInt(info.numCargoInCShipAuton)*3+parseInt(info.numCargoInRShipAuton)*3+
            parseInt(info.numHPanelsInCShipAuton)*2+parseInt(info.numHPanelsInRShipAuton)*2+parseInt(info.numCargoInCShipTele)*3+
            parseInt(info.numCargoInRShipTele)*3+parseInt(info.numHPanelsInCShipTele)*2+parseInt(info.numHPanelsInRShipTele)*2+
            parseInt(habitatPoints)+parseInt(habLinePoints)*parseInt(info.startLevel)}`
          }
        })
        .then(()=>{Alert.alert('Succesfully uploaded to database.')})
      }
    }
  ])
}

export default class TeamInfo extends React.Component {
  static navigationOptions = ({navigation}) => {
    if(navigation.getParam('delete', false)) {
      return {
        title: 'Team ' + navigation.getParam('info', 'Team').teamNum,
        headerStyle: {
          backgroundColor: 'tomato'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22
        },
        headerRight: (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => addTeam(navigation.getParam('info', null))}>
              <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-cloud-upload' : 'md-cloud-upload'} 
                size={26} style={{color: 'white', marginRight: 15}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen', {info: navigation.getParam('info', null)})}>
              <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'} 
                size={26} style={{color: 'white', marginRight: 15}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(navigation.getParam('info', null).teamNum, navigation)}>
              <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'} 
                size={26} style={{color: 'white', marginRight: 15}}/>
            </TouchableOpacity>
          </View>
        )
      }
    }
    else {
      return {
        title: 'Team ' + navigation.getParam('info', null).teamNum,
        headerStyle: {
          backgroundColor: 'tomato'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22
        }
      }
    }
  };

  state = {
    teams: [],
    refreshing: false,
    loaded: false
  };

  render() {
    const { info } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <View style={styles.subtitleContainer}>   
          <Text style={styles.subtitleText}>Autonomous</Text>
        </View>      
        <Text style={styles.bodyText}>The robot started on level
          <Text style={styles.emphasisGreen}> {info.startLevel} </Text>
          of the habitat</Text>
        <Text style={styles.bodyText}>The robot 
          {(info.gotOffHabitat==='yes') ? <Text style={styles.emphasisGreen}> did </Text> : <Text style={styles.emphasisRed}> did not </Text>}
          get off the habitat</Text>
        <Text style={styles.bodyText}>It
          {(info.crossedBaseline==='yes') ? <Text style={styles.emphasisGreen}> did </Text> : <Text style={styles.emphasisRed}> did not </Text>}
          cross the baseline</Text>
        <Text style={styles.bodyText}>It used
          {(info.usedVision==='yes') ? <Text style={styles.emphasisGreen}> vision </Text> : <Text style={styles.emphasisRed}> auton </Text>}
        </Text>
        <Text style={styles.bodyText}>It put <Text style={styles.emphasisGreen}>{info.numCargoInCShipAuton}</Text> cargo in the cargo ship</Text>
        <Text style={styles.bodyText}>It put <Text style={styles.emphasisGreen}>{info.numCargoInRShipAuton}</Text> cargo in the rocket ship</Text>
        <Text style={styles.bodyText}>It attached <Text style={styles.emphasisGreen}>{info.numHPanelsInCShipAuton}</Text> hatch panels to the cargo ship</Text>
        <Text style={styles.bodyText}>It attached <Text style={styles.emphasisGreen}>{info.numHPanelsInRShipAuton}</Text> hatch panels to the rocket ship</Text>
        

        <View style = {styles.divider} />
        <View style={styles.subtitleContainer}>   
          <Text style={styles.subtitleText}>Tele-op</Text>
        </View> 
        <Text style={styles.bodyText}>It put <Text style={styles.emphasisGreen}>{info.numCargoInCShipTele}</Text> cargo in the cargo ship</Text>
        <Text style={styles.bodyText}>It put <Text style={styles.emphasisGreen}>{info.numCargoInRShipTele}</Text> cargo in the rocket ship</Text>
        <Text style={styles.bodyText}>It attached <Text style={styles.emphasisGreen}>{info.numHPanelsInCShipTele}</Text> hatch panels to the cargo ship</Text>
        <Text style={styles.bodyText}>It attached <Text style={styles.emphasisGreen}>{info.numHPanelsInRShipTele}</Text> hatch panels to the rocket ship</Text>
        

        <View style = {styles.divider} />
        <View style={styles.subtitleContainer}>   
          <Text style={styles.subtitleText}>End-game</Text>
        </View>  
        <Text style={styles.bodyText}>It reached <Text style={styles.emphasisGreen}>level {info.habitatHeight}</Text> on the habitat</Text>
        <Text style={styles.bodyText}>
          {!info.extraComments.trim()=='' ? <Text style={styles.bodyText}>Extra comments: <Text style={styles.emphasisGreen}>{info.extraComments}</Text></Text> : <Text style={styles.emphasisRed}>There were no extra comments</Text>}
        </Text>      

        <View style = {styles.divider} />
        <Text style={styles.bodyText}>They collected a total of <Text style={styles.emphasisGreen}>{info.totalPoints}</Text> points.</Text>

        <View style = {styles.divider} />
      </ScrollView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    bodyText: {
      flex: 4,
      marginTop: 10,
      fontSize: 18,
      marginLeft: 10,
      color: 'grey'
    },
    emphasisGreen: {
      fontWeight: 'bold',
      fontSize: 20,
      color: 'green'
    },
    emphasisRed: {
      fontWeight: 'bold',
      fontSize: 20,
      color: 'red'
    },
    subtitleContainer: {
      marginBottom: -5,
      alignItems: 'center',
      marginTop: 5
    },
    subtitleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'tomato',
    },
    divider: {
      backgroundColor: '#eee',
      height: 35,
      marginTop: 10,
    },
  });
  