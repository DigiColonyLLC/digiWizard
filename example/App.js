/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {Wizard, Step, Breadcrumb} from 'digiWizard';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const wizard = useRef();

  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [stepTitle, setStepTitle] = useState('DigiWizard');
  const [transition, setTransition] = useState('slideLeft');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.headerContainer}>
          <Button
            title="Prev"
            disabled={isFirst}
            onPress={() => {
              setTransition('slideRight');
              wizard.current.prev();
            }}
          />
          <Text style={styles.headerTitle}>{stepTitle}</Text>
          <Button
            title="Next"
            disabled={isLast}
            onPress={() => {
              setTransition('slideLeft');
              wizard.current.next();
            }}
          />
        </View>
      </SafeAreaView>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flexGrow: 1,
        }}>
        <Wizard
          ref={wizard}
          style={styles.wizardContainer}
          isFirstStep={val => setIsFirst(val)}
          isLastStep={val => setIsLast(val)}
          currentStep={(step, title, total) => {
            if (title) {
              setStepTitle(`${step + 1}. ${title}`);
            }
          }}
          transition={transition}>
          <Breadcrumb
            orientation={'vertical'}
            quickNav={true}
            onColor={'#4719ff'}
            offColor={'#ececec'}
          />
          <Step style={styles.step} title="One">
            <Text>One</Text>
          </Step>
          <Step title="Two">
            <Text>Two</Text>
          </Step>
          <Step title="Three">
            <Text>Three</Text>
          </Step>
        </Wizard>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    padding: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  step: {
    flexGrow: 1,
  },
  wizardContainer: {
    padding: 16,
    flexDirection: 'row',
    flexGrow: 1,
  },
});

export default App;
