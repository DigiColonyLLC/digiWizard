import React from 'react'
import {View, Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({})
const { width, height } = Dimensions.get('window')

const Step = ({ style, children }) => {
  return <View style={style}>{children}</View>
}

export default Step