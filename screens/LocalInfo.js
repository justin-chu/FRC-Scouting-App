import React from 'react';
import { Modal, Dimensions, FlatList, AsyncStorage, ActivityIndicator, Platform, RefreshControl, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'expo';
import ListItem from '../components/ListItem';
import Search from 'react-native-search-box';

export default class LocalInfo extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
      return {
      title: 'Your Teams',
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: 'tomato',
        elevation:0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 22
      },
      headerLeft: (
        <TouchableOpacity onPress={() => {params.setModalVisible(true)}}>
          <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} 
            size={26} style={{color: 'white', marginLeft: 15}}/>
        </TouchableOpacity>
      )
    }
  };

  state = {
    teams: [],
    filteredTeams: [],
    refreshing: false,
    loaded: false,
    modalVisible: false
  };
  
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      navigation.setParams({
        setModalVisible: this.setModalVisible.bind(this)
      });
      var newTeams = [];
      AsyncStorage.getAllKeys((err, keys) => {
        console.log(keys.length)
        for(var i in keys) {
          AsyncStorage.getItem(keys[i]).then(item => {
            newTeams.push(JSON.parse(item));
            console.log(JSON.parse(item))
          })
        }
        this.setState({ teams: newTeams, filteredTeams: newTeams, loaded: true });
      });    
    });
  }

  loadingScreen = () =>{
    return <ActivityIndicator style={{paddingTop: 10}}size="large" />
  }

  loadListItem = ( rank, teamNum, score ) => {
    console.log(rank +", "+teamNum+", "+score)
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('TeamInfo', {info: this.state.teams[rank-1], delete: true})}>
        <ListItem props={this.props} rank={rank} teamNum={teamNum} score={score} />
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.setState({refreshing: true})
    this.componentDidMount()
    this.setState({ refreshing: false })
  }

  searchFilter = ( text ) => {
    if(text==="cancel") {
      this.setState({ filteredTeams: this.state.teams })
    }
    else {
      const newTeams = [];
      for(i=0; i<this.state.teams.length; i++) {
        if(this.state.teams[i].teamNum.substring(0, text.length)===text) {
          newTeams.push(this.state.teams[i])
        }
      }
      this.setState({ filteredTeams: newTeams })
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  render() {
    if(!this.state.loaded){
    return this.loadingScreen()
    }
    return (
      <View style={styles.container}>
        <View style={{width: '100%', borderColor: 'tomato', marginTop: -20, marginBottom: 15}}>
          <Search
            backgroundColor="tomato"
            onChangeText={(text)=>this.searchFilter(text)}
            onCancel={()=>this.searchFilter("cancel")}
            onDelete={()=>this.searchFilter("cancel")}
            placeholder="Search team numbers"
            searchIconCollapsedMargin={(Dimensions.get('window').width / 4)*1 - 20}
            placeholderCollapsedMargin={(Dimensions.get('window').width / 4)*1 - 30}
            keyboardType="number-pad"
            ref="search_box"
          />
        </View>

        <View style={styles.labelContainer}>
          <View style={{alignItems:'center', flex: 1}}>
            <Text style={styles.labelText}>Team #</Text>
          </View>
          <View style={{alignItems:'center', flex: 1}}>
            <Text style={styles.labelText}>Score</Text>
          </View>
        </View>

        <FlatList 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            /> 
          }
          style={styles.list}
          data={this.state.filteredTeams}
          keyExtractor={(item, index) =>  index.toString()}
          renderItem={({item, index}) => 
          this.loadListItem(index+1, this.state.filteredTeams[index].teamNum, this.state.filteredTeams[index].totalPoints) }/>
        
        {(this.state.refreshing)?<Text style={{color: 'grey'}}>Refreshing...</Text>
        :<Text style={{color: 'grey'}}>Swipe down to refresh</Text>}

        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={()=>this.setModalVisible(false)}
          visible={this.state.modalVisible}>
          <View style={{marginLeft: 80, marginTop: 200, borderRadius: 30, width: 250, height: 285, backgroundColor: 'tomato'}}>
            <View style={{alignItems: 'center', marginTop: 10, marginBottom: 15}}>
              <View style={{borderBottomWidth: 2, borderColor: 'white'}}>
                <Text style={styles.modalHeader}>Your teams:</Text>
              </View>
              <View style={{alignItems: 'left', marginTop: 5, marginLeft: 20, marginRight: 20}}>
                <Text style={styles.modalText}>The teams listed here are the ones you submitted and are only available to you.</Text> 
                <Text style={styles.modalText}>If you did not have internet when submitting the entry, 
                  wait until you have internet to resubmit it, or let someone else with
                  internet copy the information and submit it to the database.</Text>
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
      paddingTop: 15,
      backgroundColor: '#fff',
      alignItems: 'center'
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
    },
    itemContainer: {
      flexDirection: 'row',
      borderBottomColor: '#e6e6e6',
      borderBottomWidth: 1,
    },
    labelContainer: {
      flexDirection: 'row',
      marginTop: -10, 
      height: 20,
      borderBottomColor: 'grey',
      borderBottomWidth: 1,
    },
    labelText: {   
      fontSize: 14,
      color: 'grey'
    },
    list: {
      width: '100%'
    },
    listItem: {
      fontSize: 20,
      flex: 1
    }
  });
  