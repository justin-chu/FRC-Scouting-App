import React from 'react';
import { StatusBar, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, ScrollView, AsyncStorage, Modal } from 'react-native';
import { Icon } from 'expo';
import { db } from '../config';

_storeData = async (info) => {
  var habLinePoints = (info.crossedBaseline === 'yes' ? "3" : "0")
  var habitatPoints = (info.habitatHeight < 3 ? `${parseInt(info.habitatHeight)*3}` : "12")
  const totalPoints = `${(parseInt(info.numCargoInCShipAuton)+parseInt(info.numCargoInRShipAuton)+
    parseInt(info.numCargoInCShipTele)+parseInt(info.numCargoInRShipTele))*3+
    (parseInt(info.numHPanelsInCShipAuton)+parseInt(info.numHPanelsInRShipAuton)+
    parseInt(info.numHPanelsInCShipTele)+parseInt(info.numHPanelsInRShipTele))*2+
    parseInt(habitatPoints)+(parseInt(habLinePoints)*parseInt(info.startLevel))}`
  info.totalPoints = totalPoints;
  try {
    await AsyncStorage.setItem(`${info.teamNum}`, JSON.stringify(info));
  } catch (error) {
  }
};

addItem = (info) => {  
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
    totalPoints: `${(parseInt(info.numCargoInCShipAuton)+parseInt(info.numCargoInRShipAuton)+
      parseInt(info.numCargoInCShipTele)+parseInt(info.numCargoInRShipTele))*3+
      (parseInt(info.numHPanelsInCShipAuton)+parseInt(info.numHPanelsInRShipAuton)+
      parseInt(info.numHPanelsInCShipTele)+parseInt(info.numHPanelsInRShipTele))*2+
      parseInt(habitatPoints)+(parseInt(habLinePoints)*parseInt(info.startLevel))}`
    }
  });
}

showScoutingInfo = () => {
  Alert.alert("Scouting Other Teams:", "As you watch their matches, record ALL their scores in the input fields. \n\n(optional) If you have extra comments (like if the team was penalized, state them at the bottom. \n\nOnce you are finished recording everything, tap the submit button.")
}

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'FRC 7520',
      headerStyle: {
        backgroundColor: 'tomato'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 22
      },
      headerLeft: (
        <TouchableOpacity onPress={()=>Platform.OS === 'ios' ? params.setModalVisible(true) : showScoutingInfo()}>
          <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} 
            size={26} style={{color: 'white', marginLeft: 15}}/>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => {params.clearButton()}}>
          <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} 
            size={26} style={{color: 'white', marginRight: 15}}/>
        </TouchableOpacity>
      )
    }
  };

  state = {
    teamNum: '',
    startLevel: '',
    numCargoInCShipAuton:'',
    numCargoInRShipAuton:'',
    numHPanelsInCShipAuton:'',
    numHPanelsInRShipAuton:'',
    numCargoInCShipTele:'',
    numCargoInRShipTele:'',
    numHPanelsInCShipTele:'',
    numHPanelsInRShipTele:'',
    habitatHeight:'',
    gotOffHabitat: '',
    crossedBaseline: '',
    usedVision: '',
    extraComments: '',
    modalVisible: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    const info = navigation.getParam('info', null)
    if(info) {
      this.setState({teamNum: info.teamNum})
      this.setState({startLevel: info.startLevel})
      this.setState({numCargoInCShipAuton: info.numCargoInCShipAuton})
      this.setState({numCargoInRShipAuton: info.numCargoInRShipAuton})
      this.setState({numHPanelsInCShipAuton: info.numHPanelsInCShipAuton})
      this.setState({numHPanelsInRShipAuton: info.numHPanelsInRShipAuton})
      this.setState({numCargoInCShipTele: info.numCargoInCShipTele})
      this.setState({numCargoInRShipTele: info.numCargoInRShipTele})
      this.setState({numHPanelsInCShipTele: info.numHPanelsInCShipTele})
      this.setState({numHPanelsInRShipTele: info.numHPanelsInRShipTele})
      this.setState({habitatHeight: info.habitatHeight})
      this.setState({gotOffHabitat: info.gotOffHabitat})
      this.setState({crossedBaseline: info.crossedBaseline})
      this.setState({usedVision: info.usedVision})
      this.setState({extraComments: info.extraComments})
      }
    navigation.setParams({
      setModalVisible: this.setModalVisible.bind(this),
      clearButton: this.clearButton.bind(this)
    });
  }
  
  clearButton = () => {
    Alert.alert("Are you sure you want to clear all fields?", "",
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {}
      },
      {
        text: 'OK', 
        onPress: () => {
          this.clearInputs()
        }
      }
    ])
  }

  handleChange = (name, text) => {
    this.setState({
      [name]: text.nativeEvent.text
    });
  }
  
  handleBoolean = (name, text) => {
    this.setState({
      [name]: text
    });
  }

  handleSubmit = () => {
    if(Object.values(this.state).splice(0,13).includes(''))
      Alert.alert('Please fill out all fields (including buttons)');
    else {
      if(this.state.teamNum.trim()==="0")
        Alert.alert('The team number cannot be 0');
      else if(!Object.values(this.state).splice(0,11).every((i)=>{return Number.isInteger(+i)}))
        Alert.alert('Please use only numbers for the scores', 'No letters, symbols or spaces');
      else if(this.state.startLevel.trim()!=="1"&&this.state.startLevel.trim()!=="2")
        Alert.alert('The robot can only start on habitat levels 1 or 2');
      else if(this.state.habitatHeight.trim()!=="0"&&this.state.habitatHeight.trim()!=="1"&&this.state.habitatHeight.trim()!=="2"&&this.state.habitatHeight.trim()!=="3")
        Alert.alert('The robot can only finish on habitat levels 0, 1, 2 or 3');
      else {
        _storeData(this.state)
        addItem(this.state)
        this.clearInputs()
        Alert.alert('Item saved successfully','',
        [
          {
            text: 'OK', 
            onPress: () => {(this.props.navigation.dangerouslyGetParent().state.routeName==='LocalStack') ? this.props.navigation.navigate('LocalInfo') : {}}
          }
        ]);
      }
    }
  }

  clearInputs = () => {
    this.setState({
      teamNum: '',
      startLevel: '',
      gotOffHabitat: '',
      crossedBaseline: '',
      usedVision: '',
      numCargoInCShipAuton:'',
      numCargoInRShipAuton:'',
      numHPanelsInCShipAuton:'',
      numHPanelsInRShipAuton:'',
      numCargoInCShipTele:'',
      numCargoInRShipTele:'',
      numHPanelsInCShipTele:'',
      numHPanelsInRShipTele:'',
      habitatHeight:'',
      extraComments: '',
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  render() {
    return (
      <View style={styles.container}>        
      <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={64} behavior="padding">
          <ScrollView style={styles.container}>
            
            {/*------------------------------------- Header -------------------------------------*/}
            <View style={styles.bodyContainer}>

              <Text style={styles.bodyText}>FRC Team Number:</Text>
              <TextInput value={this.state.teamNum} onChange={(text)=>{this.handleChange("teamNum", text)}} 
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} 
                placeholder={"eg. 7520"} style={styles.inputText}></TextInput>

            {/*------------------------------------- Autonomous ------------------------------------*/}
              <View style = {styles.divider} />
              <View style={styles.subtitleContainer}>   
                <Text style={styles.subtitleText}>Autonomous</Text>
              </View>   
              
              <Text style={styles.bodyText}>Robot started on which level of the habitat:</Text>
              <TextInput value={this.state.startLevel} onChange={(text)=>{this.handleChange("startLevel", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} placeholder={"1 to 2"} style={styles.inputText}></TextInput>
      
              <View style={styles.buttonContainer}>   
                <Text style={styles.bodyText}>Could get off habitat:</Text>
                <TouchableOpacity onPress={()=>{this.handleBoolean("gotOffHabitat", 'yes')}} 
                  style={(this.state.gotOffHabitat==="yes") ? styles.selectedGreenButton : styles.greenButton}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.handleBoolean("gotOffHabitat", 'no')}} 
                  style={(this.state.gotOffHabitat==="no") ? styles.selectedRedButton : styles.redButton}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>   
                <Text style={styles.bodyText}>Crossed the baseline:</Text>
                <TouchableOpacity onPress={()=>{this.handleBoolean("crossedBaseline", 'yes')}} 
                  style={(this.state.crossedBaseline==="yes") ? styles.selectedGreenButton : styles.greenButton}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.handleBoolean("crossedBaseline", 'no')}} 
                  style={(this.state.crossedBaseline==="no") ? styles.selectedRedButton : styles.redButton}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <Text style={styles.bodyText}>Used vision/auton:</Text>
                <TouchableOpacity onPress={()=>{this.handleBoolean("usedVision", 'yes')}} 
                  style={(this.state.usedVision==="yes") ? styles.selectedGreenButton : styles.greenButton}>
                  <Text style={styles.buttonText}>Vision</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.handleBoolean("usedVision", 'no')}} 
                  style={(this.state.usedVision==="no") ? styles.selectedRedButton : styles.redButton}>
                  <Text style={styles.buttonText}>Auton</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.bodyText}>Amount of cargo put in cargo ship:</Text>
              <TextInput value={this.state.numCargoInCShipAuton} onChange={(text)=>{this.handleChange("numCargoInCShipAuton", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
                           
              <Text style={styles.bodyText}>Amount of cargo put in rocket ship:</Text>
              <TextInput value={this.state.numCargoInRShipAuton} onChange={(text)=>{this.handleChange("numCargoInRShipAuton", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
      
              <Text style={styles.bodyText}>Number of hatch panels attached to cargo ship:</Text>
              <TextInput value={this.state.numHPanelsInCShipAuton} onChange={(text)=>{this.handleChange("numHPanelsInCShipAuton", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
         
              <Text style={styles.bodyText}>Number of hatch panels attached to rocket ship:</Text>
              <TextInput value={this.state.numHPanelsInRShipAuton} onChange={(text)=>{this.handleChange("numHPanelsInRShipAuton", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
   
            {/*------------------------------------- Tele-op -----------------------------------*/}

              <View style = {styles.divider} />

              <View style={styles.subtitleContainer}>  
                <Text style={styles.subtitleText}>Tele-op</Text>   
              </View>

              <Text style={styles.bodyText}>Amount of cargo put in cargo ship:</Text>
              <TextInput value={this.state.numCargoInCShipTele} onChange={(text)=>{this.handleChange("numCargoInCShipTele", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
          
              <Text style={styles.bodyText}>Amount of cargo put in rocket ship:</Text>
              <TextInput value={this.state.numCargoInRShipTele} onChange={(text)=>{this.handleChange("numCargoInRShipTele", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
             
              <Text style={styles.bodyText}>Number of hatch panels attached to cargo ship:</Text>
              <TextInput value={this.state.numHPanelsInCShipTele} onChange={(text)=>{this.handleChange("numHPanelsInCShipTele", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
        
              <Text style={styles.bodyText}>Number of hatch panels attached to rocket ship:</Text>
              <TextInput value={this.state.numHPanelsInRShipTele} onChange={(text)=>{this.handleChange("numHPanelsInRShipTele", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} style={styles.inputText}></TextInput>
     
            {/*------------------------------------- End-game -----------------------------------*/}

              <View style = {styles.divider} />

              <View style={styles.subtitleContainer}>  
                <Text style={styles.subtitleText}>End-game</Text>    
              </View>
                             
              <Text style={styles.bodyText}>Habitat height reached:</Text>
              <TextInput value={this.state.habitatHeight} onChange={(text)=>{this.handleChange("habitatHeight", text)}}
                clearButtonMode={"while-editing"} keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'} placeholder={"0 to 3"} style={styles.inputText}></TextInput>
      
              <Text style={styles.bodyText}>Extra comments:</Text>
              <TextInput value={this.state.extraComments} onChange={(text)=>{this.handleChange("extraComments", text)}}
                clearButtonMode={"while-editing"} placeholder={"eg. It helped teammates onto the habitat"} style={styles.inputText}></TextInput>



              <View style={{alignItems: 'center', marginTop: 10}}>
                <TouchableOpacity onPress={this.handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>

              </View>
          </ScrollView>     
        </KeyboardAvoidingView>

        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={()=>{}}
          visible={this.state.modalVisible}>
          <View style={{marginLeft: 80, marginTop: 200, borderRadius: 30, width: 250, height: 290, backgroundColor: 'tomato'}}>
            <View style={{marginTop: 10, marginBottom: 15}}>
              <View style={{alignItems: 'center', borderBottomWidth: 2, borderColor: 'white'}}>
                <Text style={styles.modalHeader}>Scouting other teams:</Text>
              </View>
              <View style={{textAlign: 'left', marginTop: 5, marginLeft: 20, marginRight: 20}}>
                <Text style={styles.modalText}>As you watch their matches, 
                record <Text style={{fontWeight: 'bold'}}>all</Text> their scores in the input fields.</Text>
                <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>OPTIONAL: </Text> 
                If you have any extra comments (like if the team was penalized), state them at the bottom.</Text>
                <Text style={styles.modalText}>Once you are finished recording everything, tap the submit button.</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.modalButton}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 5
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5
  },
  modalButton: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  divider: {
    backgroundColor: '#eee',
    height: 35,
    marginTop: 10,
    marginBottom: 5
  },
  greenButton: {
    flex: 1,
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: '#07B62E',
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2
  },
  redButton: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    padding: 3,
    backgroundColor: '#F54E4E',
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2
  },
  selectedGreenButton: {
    flex: 1,
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: '#077a2e',
    borderRadius: 100,
    borderColor: 'grey',
    borderWidth: 2
  },
  selectedRedButton: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    padding: 3,
    backgroundColor: '#b94e4e',
    borderRadius: 100,
    borderColor: 'grey',
    borderWidth: 2
  },
  greenSelected: {
    flex: 1,
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 100,
    borderWidth: 1
  },
  redSelected: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    padding: 3,
    backgroundColor: 'red',
    borderRadius: 100,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  submitButton: {
    marginTop: 2,
    marginBottom: 13,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: 'tomato'
  },
  submitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'tomato',
  },
  subtitleContainer: {
    marginBottom: -5,
    alignItems: 'center'
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'tomato',
  },
  bodyText: {
    marginTop: 10,
    fontSize: 14,
    marginLeft: 10,
    color: 'grey'
  },
  inputText: {
    fontSize: 16,
    marginLeft: 10, 
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10
  }
});
