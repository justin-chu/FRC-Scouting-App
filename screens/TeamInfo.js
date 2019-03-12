import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

export default class TeamInfo extends React.Component {
  static navigationOptions = ({navigation}) => {
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
          {!info.extraComments=='' ? <Text style={styles.bodyText}>Extra comments: <Text style={styles.emphasisGreen}>{info.extraComments}</Text></Text> : <Text style={styles.emphasisRed}>There were no extra comments</Text>}
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
  