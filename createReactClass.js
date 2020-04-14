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
  if(format === undefined) {
    throw new Error('`warning(condition, format, ...args)` requires a warning '
      + 'message argument');
  }

  if(!condition) {
    console.warn(format, ...args);
  }
}

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

let ReactPropTypeLocationNames;
if(process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}
else {
  ReactPropTypeLocationNames = {};
}

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
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
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
   * @param {{ create: () => Object }} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
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

    _invariant(
      spec.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    _invariant(
      spec.create,
      'need to implement create method on class, this is how we will create instances for React.'
    );

    let createdObj;
    try {
      createdObj = spec.create.call(this, spec.defaultProps || {});
    }
    catch(err) {
      if(err.message && err.message.includes('props')) {
        console.warn('@mavega/oloo: Error occurred creating object. Make sure you are only using props that will exist not matter what. Use defaultProps.');
      }
      
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
    

    function assignDelete(value) {
      if(spec[value]) {
        Constructor[value] = spec[value];
      }
    }

    assignDelete('defaultProps');
    assignDelete('propTypes');
    assignDelete('contextTypes');
    assignDelete('childContextTypes');
    assignDelete('displayName');

    if(process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor.displayName, Constructor.propTypes, 'prop');
      validateTypeDef(Constructor.displayName, Constructor.contextTypes, 'context');
      validateTypeDef(Constructor.displayName, Constructor.childContextTypes, 'childContext');
    }

    if(process.env.NODE_ENV !== 'production') {
      warning(
        !spec.componentShouldUpdate,
        '%s has a method called '
          + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? '
          + 'The name is phrased as a question because the function is '
          + 'expected to return a value.',
        spec.displayName || 'A component'
      );

      warning(
        !spec.componentWillRecieveProps,
        '%s has a method called '
          + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );

      warning(
        !spec.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). '
          + 'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
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