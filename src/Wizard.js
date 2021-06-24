import React, { useState, useEffect } from 'react'
import { Animated, Easing, View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Step from './Step'

const adaptiveStyles = (onColor, offColor) => StyleSheet.create({
  circle: {
    borderWidth: 1,
    borderColor: offColor,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    zIndex: 50,
  },
  circleTitle: {
    fontSize: 12,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 25,
  },
  lineDivider: {
    flexGrow:1,
    borderBottomWidth: 2,
    borderBottomColor: offColor,
    marginBottom: 18, // Magic Number?
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
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

const Wizard = React.forwardRef(
  ({ style, hideTitles, quickNav, currentStep, isFirstStep, isLastStep, onColor, offColor, transition, duration, children }, ref) => {
    const [activeStep, setActiveStep] = useState(0)
    const [animationValue, setAnimationValue] = useState(undefined)
    const steps = children.filter(child => child.type === Step)
    if (steps.length === 0) return
  
    if (ref) {
      ref.current = {
        next: () => {
          activeStep < steps.length - 1 && changeStep(activeStep + 1) 
        },
        prev: () => {
          activeStep > 0 && changeStep(activeStep - 1)
        },
        goto: step => {
          if (step >= 0 && step <= steps.length - 1) {
            changeStep(step)
          }
        },
      }
    }

    useEffect(() => {
      const title = steps[activeStep] && steps[activeStep].props && steps[activeStep].props.title ? steps[activeStep].props.title : null
      currentStep && currentStep(activeStep, title, steps.length)
      isFirstStep && isFirstStep(activeStep === 0)
      isLastStep && isLastStep(activeStep === steps.length - 1)
    }, [activeStep, steps.length])

    useEffect(() => {
      switch(transition) {
        case 'slideLeft':
          const slideLeft = new Animated.Value(width)
          Animated.timing(slideLeft, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }).start()
          setAnimationValue({transform:[{translateX: slideLeft}]})
          break
        case 'slideRight':
          const slideRight = new Animated.Value(-width)
          Animated.timing(slideRight, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }).start()
          setAnimationValue({transform:[{translateX: slideRight}]})
          break
        case 'slideUp':
          const slideUp = new Animated.Value(height)
          Animated.timing(slideUp, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }).start()
          setAnimationValue({transform:[{translateY: slideUp}]})
          break
        case 'slideDown':
          const slideDown = new Animated.Value(-height)
          Animated.timing(slideDown, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }).start()
          setAnimationValue({transform:[{translateY: slideDown}]})
          break
          case 'fade':
          default:
            const opacity = new Animated.Value(0)
            Animated.timing(opacity, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }).start()
            setAnimationValue({ opacity: opacity })
      }
    }, [activeStep])

    const changeStep = (whichStep) => {
      const opacity = new Animated.Value(1)
      Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
      }).start(() => setActiveStep(whichStep))
      setAnimationValue({ opacity: opacity })
    }

    const styles = adaptiveStyles(onColor, offColor)

    return (
      <View style={style}>
        <View style={styles.container}>
          {steps.map((step, index) => {
            const { title } = step.props
            return (
              <React.Fragment key={`step-${index}`}>
                <View
                  style={{ ...styles.stepContainer }}>
                  <ConditionalWrapper 
                    condition={quickNav}
                    wrapper={children => <TouchableOpacity onPress={() => changeStep(index)}>{children}</TouchableOpacity>}
                  >
                    <Circle selectedIndex={activeStep} index={index} offColor={offColor} onColor={onColor} />  
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleCircle}>
                      {!hideTitles && title ? title : ' '}
                    </Text>
                  </ConditionalWrapper>
                </View>
                {index !== steps.length-1 && <View style={styles.lineDivider}></View>}
              </React.Fragment>
            )
          })}
        </View>
        <Animated.View style={animationValue}>
          {steps.length > activeStep ? steps[activeStep] : null}
        </Animated.View>
      </View>
    )
  },
)

Wizard.defaultProps = {
  hideTitles: false,
  quickNav: true,
  onColor: '#FFF',
  offColor: '#000',
  transition: 'none',
  duration: 300,
}

Wizard.propTypes = {
  style: PropTypes.object,
  hideTitles: PropTypes.bool,
  quickNav: PropTypes.bool,
  currentStep: PropTypes.func,
  isFirstStep: PropTypes.func,
  isLastStep: PropTypes.func,
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  transition: PropTypes.oneOf(['none','slideLeft','slideRight','slideUp','SlideDown']),
  duration: PropTypes.number,
}

export default Wizard