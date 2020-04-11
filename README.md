# LGD
- Pulled create-react-class out of react. 
- Extended functionality to work for React.PureComponents and React.Component. 

# Why to use this module.
create-react-class requires you to change the way you use React. <b>Forget about getInitialState or getDefaultProps.</b> Just use state like you normally would and when the react class gets created well initialize the state for you.

# Other Modules
- @mevega/oloo 
   - Helps with inheritance of Objects.

# Vscode Extensions
- JavaScript to Typescript Converter & Syntax Highlighter
   - Help with AutoComplete in vscode for React methods.
   - Helps with inheritance when using plain Objects.
   - Provides Linting of Objects for CreateReactClass.
- JS/React Snippet Extension.

# Examples

``` js
import BaseModal from 'SRC/Modals/BaseModal';
import propTypes from 'prop-types';
import styles from 'SRC/Utilities/Styles';

const { Oloo } = require('@mavega/oloo');
const createReactPure = require('create-react').createReactPure;

/**
* @description A modal that helps with
* @type {InputModalType}
* @extends {BaseModalType, React.Component<InputModal.propTypes>}
*/
const InputModal = {
  // Helps with debugging if error occurs. Should be removed in production by babel or something.
  // displayName also works.
  constructor: function InputModal() {},
  displayName: 'InputModal',

  /**
  * @description Initialize an instance of InputModal.
  * @returns {InputModalType}
  */
  create() {
    const inputModal = Oloo.assign(BaseModal.create(), InputModal);

    inputModal.modalStyle = {
      ...inputModal.modalStyle,
      ...styles.messageBoxStyle
    };

    /**
     * @description This is how you set state of the Object.
     * State can't be used in PureComponent.
     */
    input.state = {
      example: 'Not available in Pure'
    }

    return inputModal;
  },

  componentDidMount() {
    // Use like normal.
  },

  setStateExample() {
    this.setState({ example: 'i changed state' });
  }

  renderBody() {
    return (
      <div>
        <h1>Hi</h1>
      </div>
    );
  },

  render() {
    if(!this.props.showing) {
      return null;
    }

    return this.renderModal(
      this.renderBody(),
      this.modalStyle,
      this.props.onClosed
    );
  }
};

InputModal.propTypes = {
  /**
  * @description Boolean that determines whether we are showing this modal.
  */
  showing: propTypes.bool.isRequired,

  /**
  * @description Function called when we want to close this modal.
  */
  onClosed: propTypes.func.isRequired
};

export const InputModalObject = InputModal;
export default createReactPure(InputModal.create());
```

``` js
import InputModal from 'SRC/InputModal';

// Now you can use it like any React Component.
<InputModal />
```

# Release Notes

## 1.0.0
