/* Authored by Chubak Bidpaa: chubakbidpaa@gmail.com - 2020 - Corona Times */

import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

export default class ListenerView extends Component {
componentWillMount() {}
componentDidMount() {}
componentWillUnmount() {}

render() {
const navigation = useNavigation();
return (
<View style={styles.container}>
    <Text> This is the Listener component. </Text>
</View>
);
}
}

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: "center",
justifyContent: "spaced-around",
paddingHorizontal: 30,
},
});

ListenerView.propTypes = {
children: PropTypes.element.isRequired,
};