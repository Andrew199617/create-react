/* eslint-disable id-length */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-eval */
/* eslint-disable react/forbid-foreign-prop-types */
/* eslint-disable no-invalid-this */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-lines-per-function */

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function _invariant(condition, format, ...args) {
  if(typeof format !== 'string') {
    throw new Error('2nd argument must be string');
  }

  if(!condition) {
    let error;
    if(format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment '
         + 'for the full error message and additional helpful warnings.',);
    }
    else {
      let argIndex = 0;
      error = new Error(format.replace(/%s/g, () => String(args[argIndex++])));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1;
    throw error;
  }
}

function warning(condition, format, ...args) {
  if(condition) {
    return;
  }

  var argIndex = 0;
  var message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
  if (typeof console !== 'undefined') {
    console.error(message);
  }
  try {
    // --- Welcome to debugging React ---
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message);
  } catch (x) {}
}

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}  

/**
* Methods that React Interacts with. 
* Everything else only needs to be known about by the class that created it.
*/
const ReactClassStaticInterface = {
 /**
  * This method is invoked after a component is instantiated and when it
  * receives new props. Return an object to update state in response to
  * prop changes. Return null to indicate no change to state.
  *
  * If an object is returned, its keys will be merged into the existing state.
  *
  * @return {object || null}
  * @optional
  */
 getDerivedStateFromProps: 'TOP_LEVEL',

 /**
 * @description This lifecycle is invoked after an error has been thrown by a descendant component. It receives the error that was thrown as a parameter and should return a value to update state.
 */
 getDerivedStateFromError: 'TOP_LEVEL',

 /**
 * @description Next.js static function.
 */
 getInitialProps: 'TOP_LEVEL'
};

function factory(ReactComponent, defaultClass, ReactNoopUpdateQueue) {

  function validateTypeDef(displayName, typeDef, location) {
    for(const propName in typeDef) {
      if(typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if(process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from '
              + 'React.PropTypes.',
            displayName || 'ReactClass',
            location,
            propName
          );
        }
      }
    }
  }

  function assignStatics(Constructor, statics, spec, deleteStatics) {
    for (var name in statics) {
      if(typeof spec[name] === 'function') {
        Constructor[name] = spec[name];
        if(deleteStatics) {
          delete spec[name];
        }
      }
      else if(typeof statics[name] === 'function') {
        Constructor[name] = statics[name];
      }
    }
    
    if(deleteStatics) {
      delete spec['statics'];
    }
  }

  function ReactClassComponent() {}

  Object.assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    {
      /**
       * TODO: This will be deprecated because state should always keep a consistent
       * type signature and the only use case for this, is to avoid that.
       */
      replaceState(newState, callback) {
        this.updater.enqueueReplaceState(this, newState, callback);
      }
    }
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {{ create: () => Object, statics: Object }} spec Class specification (which must define `render`).
   * @param {{ deleteStatics: boolean, staticsFunctions: Object }} options deleteReactStatics since we don't need them.
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec, options) {
    options = options || { deleteStatics: true };
    options.staticsFunctions = Object.assign({}, ReactClassStaticInterface, options.staticsFunctions, spec.statics );
    let functions = { length: 0 };
    let descriptors = {};

    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    const Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.
      if(process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or '
            + 'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      this.props = props;
      this.context = context;
      this.refs = {};
      this.updater = updater || ReactNoopUpdateQueue;
      this.state = null;

      for (let index = 0; index < functions.length; index++) {
        this[functions[index].key] = functions[index].func.bind(this);
      }

      // Assign getters and setters to this.
      Object.defineProperties(this, descriptors);

      const createdObj = spec.create.call(this, props);
      if(createdObj) {
        Object
          .keys(createdObj)
          .forEach(element => {
            this[element] = createdObj[element];
          });
      }
    });

    Constructor.prototype = new ReactClassComponent();

    // Helps with debugging. Will log the name of the constructor when a error occurs.
    // Defaults to ReactClassComponent
    if(spec.constructor) {
      Constructor.prototype.constructor = spec.constructor;
    }
    else if(process.env.NODE_ENV !== 'production') {
      eval(`Object.defineProperty(Constructor.prototype, 'constructor', { value: function ${spec.displayName || 'ReactClassComponent'}(...params) { return Constructor(...params) }, writable: false, enumerable: false, configurable: false });`);
    }
    else {
      Constructor.prototype.constructor = Constructor;
    }

    const constructorProto = Constructor.prototype;

    function assignDelete(value, deleteStatics) {
      if(typeof spec[value] !== 'undefined') {
        Constructor[value] = spec[value];
        if(deleteStatics) {
          delete spec[value];
        }
      }
    }

    assignDelete('defaultProps', options.deleteStatics);
    assignDelete('propTypes', options.deleteStatics);
    assignDelete('contextType', options.deleteStatics);
    assignDelete('contextTypes', options.deleteStatics);
    assignDelete('childContextTypes', options.deleteStatics);
    assignDelete('displayName', false);

    _invariant(
      spec.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    _invariant(
      spec.create,
      'createClass(...): need to implement create method on class, this is how we will create instances for React.'
    );

    _invariant(
      typeof (spec.statics || {}) === 'object',
      'createClass(...): statics must be an object.'
    );
    
    assignStatics(Constructor, options.staticsFunctions, spec, options.deleteStatics);

    let createdObj;
    try {
      createdObj = spec.create.call(this, spec.defaultProps || {});
    }
    catch(err) {
      warning(false, 'Error occurred creating object. Possible Solution: Make sure you are only using props that will exist no matter what. Define them using defaultProps.');
      throw err;
    }

    let newObject = createdObj ? Object.getPrototypeOf(createdObj) : spec;

    const addedFunctions = {};
    let obj = {};
    let thisProto = Object.getPrototypeOf(constructorProto);
    let setProtoOnObj = false;

    while(newObject !== Object.prototype) {
      let setOnProto = false;
      Object.keys(newObject)
        .forEach(key => {
          const descriptor = Object.getOwnPropertyDescriptor(newObject, key);
          if(typeof descriptor.get === 'undefined' && typeof descriptor.set === 'undefined') {
            if(typeof newObject[key] === 'function') {
              if(key === 'constructor') {
                obj[key] = newObject[key];
                setOnProto = true;
              }
              else if(options.staticsFunctions[key]) {
                // no-op
              }
              else if(addedFunctions[key]) {
                if(key !== 'create') {
                  // no need to bind, if you use Oloo.base it will bind at runtime.
                  obj[key] = newObject[key];
                  setOnProto = true;
                }
              }
              else {
                addedFunctions[key] = true;
                functions[functions.length] = { key, func: newObject[key] };
                functions.length++;
              }
            }
            // Ignoring properties since we are assuming they are static properties.
          }
          else {
            descriptors[key] = descriptor;
          }
        });

      newObject = Object.getPrototypeOf(newObject);
      if(setOnProto) { 
        setProtoOnObj = true;
        if (newObject !== Object.prototype) {
          // This is so we keep inherited methods if there are any.
          const newProto = {};
          Object.setPrototypeOf(obj, newProto)
          obj = newProto;
        }
      }
    }
    
    if(setProtoOnObj) {
      Object.setPrototypeOf(thisProto, obj);
    }

    if(process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor.displayName, Constructor.propTypes, 'propTypes');
      validateTypeDef(Constructor.displayName, Constructor.contextTypes, 'contextTypes');
      validateTypeDef(Constructor.displayName, Constructor.childContextTypes, 'childContextTypes');

      warning(
        !Constructor.childContextTypes, 
        "%s using legacy childContextTypes.",
        spec.displayName || 'ReactClass'
      );

      warning(
        !Constructor.contextTypes, 
        "%s using legacy contextTypes.",
        spec.displayName || 'ReactClass'
      );

      warning(
        !spec.componentShouldUpdate,
        '%s has a method called '
          + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? '
          + 'The name is phrased as a question because the function is '
          + 'expected to return a value.',
        spec.displayName || 'ReactClass'
      );

      warning(
        !spec.componentWillRecieveProps,
        '%s has a method called '
          + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'ReactClass'
      );

      warning(
        !spec.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). '
          + 'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'ReactClass'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for(const methodName in defaultClass) {
      if(!spec[methodName]) {
        constructorProto[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;