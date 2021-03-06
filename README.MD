# Digi-RN-Wizard

Create multi-step wizards in React Native applications to guide users through setup or other complex tasks in a simple manner.  

## Installation

1. Install:
    - Using [npm](https://www.npmjs.com/#getting-started): `npm install digi-rn-wizard --save`
    - Using [Yarn](https://yarnpkg.com/): `yarn add digi-rn-wizard`

2. Import it in your JS:

```js
import {Wizard, Step} from 'digi-rn-wizard';
```

## Basic Usage

```
import {Wizard, Step, Breadcrumb} from 'digi-rn-wizard';

<Wizard>
  <Breadcrumb />
  <Step title="Start">
    <Text>Each step can contain any content you wish to render.</Text>
  </Step>
  <Step title="Middle">
    <View>
      <Text>It can contain text, controls or other custom components.</Text>
      <TextInput
        onChangeText={onChangeText}
        value={text}
      />
    </View>
  </Step>
  <Step title="Complete">
    <Text>The number of steps is dynamic, but must be contained in a Step component.</Text>
  </Step>
</Wizard>
```

## Advanced Usage

See the example app to understand how to implement more advanced features.

## Available Properties

#### Wizard
| Prop | Type | Default  | Description |
|-----|-----------|----------------|-------------|
| `ref` | void | optional | Reference to use function including `next()`, `prev()`, and `goto()` |
| `style` | object | optional | Style object for the main container |
| `currentStep` | func | optional | Callback containing the index and title of the current step as well as number of total steps|
| `isFirstStep` | func | optional | Callback containing boolean value is current step is first step |
| `isLastStep` | func | optional | Callback containing boolean value if current step is last step |
| `transition` | string | `fade` | Type of transition between steps |
| `duration` | number | 300 | Time for transition to complete |

#### Step
| Prop | Type | Default  | Description |
|-----|-----------|----------------|-------------|
| `title` | string | optional | Title of the step, returned by currentStep |

#### Breadcrumb
| Prop | Type | Default  | Description |
|-----|-----------|----------------|-------------|
| `orientation` | string | horizontal | Set the orientation of the breadcrumb bar, horizontal or vertical |
| `quickNav` | bool | true | Allow navigation to step by tapping on breadcrumb |
| `onColor` | string | `#FFFFFF`| Color of breadcrumb when selected |
| `offColor` | string | `#000000` | Color of breadcrumbs when not selected |

The position of the breadcrumb component will determine it's rendering position.  Make it the first child under Wizard to render it before the step or make it the last child under Wizard to render it after the step.  Combined with the `orientation` prop you can position and scale the breadcrumb bar on any side of the Wizard's steps.

## Reference Functions

DigiWizard provides the following reference functions so you can create custom controls for the wizard to better match the UI of your application. Create a reference to the Wizard using the useRef hook:

```
import React, {useRef} from 'react'
const wizard = useRef(null)

<Wizard ref={wizard} />
```

#### next()  

`wizard.current.next()` This function will advance the wizard to the next step, if available. If additional steps are not available the call will be ignored.

#### prev()  

`wizard.current.prev()` This function will revert the wizard to the previous step, if available. If additional steps are not available the call will be ignored.

#### goto(step)  

`wizard.current.goto(step)` This function will change the wizard to the provided step, if available. If the provided step is outside the bounds of the available steps the call will be ignored. `step` is a 0 based index.