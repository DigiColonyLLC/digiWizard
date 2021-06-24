import React from 'react'
import {View, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

const adaptiveStyles = (onColor, offColor, orientation) => StyleSheet.create({
    circle: {
        borderWidth: 1,
        borderColor: offColor,
        borderRadius: 50,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      },
      circleTitle: {
        fontSize: 12,
        zIndex: 100,
      },
      container: {
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 25,
      },
      lineDivider: {
        flexGrow: 1,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderLeftColor: offColor,
        borderBottomColor: offColor,
      },
      titleCircle: {
        marginTop: 5,
        fontSize: 12,
        paddingBottom: 10,
        alignSelf: 'center',
        zIndex: 50,
      },
  })

const { width, height } = Dimensions.get('window')

const ConditionalWrapper = ({ condition, wrapper, children }) => condition ? wrapper(children) : children

const Circle = ({ index, selectedIndex, onColor, offColor }) => {
  const styles = adaptiveStyles(onColor, offColor)
  return (
    <View
      style={
        index === selectedIndex
          ? { ...styles['circle'], backgroundColor: onColor } // Should I Make Two Styles?
          : { ...styles['circle'], backgroundColor:  offColor }
      }>
      <Text style={{...styles['circleTitle'], color : index === selectedIndex ? offColor : onColor}}>
        {index + 1}
      </Text>
    </View>
  )
}

const Breadcrumb = ({ quickNav, onColor, offColor, orientation, steps, changeStep, activeStep }) => {
    const styles = adaptiveStyles(onColor, offColor, orientation)
  return (
  <View style={styles.container}>
    {steps.map((step, index) => {
        const { title } = step.props
    return (
      <React.Fragment key={`step-${index}`}>
          <ConditionalWrapper 
            condition={quickNav}
            wrapper={children => <TouchableOpacity onPress={() => changeStep(index)}>{children}</TouchableOpacity>}
          >
            <Circle selectedIndex={activeStep} index={index} offColor={offColor} onColor={onColor} />
          </ConditionalWrapper>
        {index !== steps.length-1 && <View style={styles.lineDivider}></View>}
      </React.Fragment>
    )
  })}
            </View>)
}

Breadcrumb.defaultProps = {
  orientation: 'horizontal',
  quickNav: true,
  onColor: '#FFF',
  offColor: '#000',
}

Breadcrumb.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  quickNav: PropTypes.bool,
  onColor: PropTypes.string,
  offColor: PropTypes.string,
}

export default Breadcrumb