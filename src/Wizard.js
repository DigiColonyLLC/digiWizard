import React, { useState, useEffect } from 'react'
import { Animated, View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Step from './Step'
import Breadcrumb from './Breadcrumb'

const { width, height } = Dimensions.get('window')

const Wizard = React.forwardRef(
  ({ style, currentStep, isFirstStep, isLastStep, transition, duration, children }, ref) => {
    const [activeStep, setActiveStep] = useState(0)
    const [animationValue, setAnimationValue] = useState(undefined)
    const steps = children.filter(child => child.type === Step)
    if (steps.length === 0) return
    const breadcrumbs = children.find(child => child.type === Breadcrumb)
    const breadcrumbIndex = children.findIndex(child => child.type === Breadcrumb)
  
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

    const key="breadcrumbView"
    const components = []
    if(breadcrumbs) components.push(React.cloneElement(breadcrumbs, {key, changeStep, activeStep, steps}, null))
    if(steps.length > activeStep) {
      components.push(
        <Animated.View key="stepView" style={{...animationValue, ...steps[activeStep].props.style}}>
          {steps[activeStep]}
        </Animated.View> 
      )
    }

    if(breadcrumbIndex > steps.length-1) components.reverse()

    return (
      <View style={style}>
        {components}
      </View>
    )
  },
)

Wizard.defaultProps = {
  transition: 'none',
  duration: 300,
}

Wizard.propTypes = {
  style: PropTypes.object,
  currentStep: PropTypes.func,
  isFirstStep: PropTypes.func,
  isLastStep: PropTypes.func,
  transition: PropTypes.oneOf(['none','slideLeft','slideRight','slideUp','SlideDown']),
  duration: PropTypes.number,
}

export default Wizard