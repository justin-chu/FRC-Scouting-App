import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import { Icon } from 'expo';

export default class ListItem extends React.Component {  
  render() {
    return (
      <View style={styles.itemContainer}>
          <View style={styles.container}>
            <Text style={{paddingLeft: 20, flex: 1, fontSize: 20}}>{this.props.teamNum}</Text>
          </View>
          <View style={styles.container}>
            <Text style={{paddingLeft: 40, flex: 1, fontSize: 20}}>{this.props.score}</Text>
          </View>
          <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
            size={26} style={{color: '#D3D3D3', marginTop: 9, marginRight: 15}}/>
      </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    itemContainer: {
      flexDirection: 'row',
      borderBottomColor: '#e6e6e6',
      borderBottomWidth: 1,
    }
  });
  