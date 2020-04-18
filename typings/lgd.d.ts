
declare module '@mavega/react' {

  import { ClassicComponentClass } from "react";

  interface Options {
    /**
     * @description Should we delete statics from the object. Default is true.
     * If you want to be able to call a static function like getDerivedStateAndProps
     * or if you want to use propTypes/defaultProps then set this to false. 
     * It is recommended you leave this on, so we clean up unnecessary properties.
     * DisplayName will always be available.
     */
    deleteStatics: boolean; 

    /**
     * @description Static Functions that we will append to React Class.
     * These are functions that will be Deleted from the Object you 
     * passed in and only exist on the React class.
     * Use if you are using a framework that needs static functions on React Object.
     * ``` js 
     * { newFunc() { // default execution. }, func: true }
     * ```
     * If Spec defines newFunc then it will overwrite the newFunc.
     */
    staticFunctions: { 
      getDerivedStateFromProps: string, 
      getDerivedStateFromError: string, 
      getInitialProps: string
    };
  }

  /**
  * @description Create-React-Classes
  */
  const CreateReact: {

    /**
     * @description Create a React Component using an Object.
     *
     * Usage:
     * 
     * You can use 'this' in create to set the instance created by react.
     * 'Create' returns an obj whos' functions we'll bind to the react instance.
     * We'll also assign all variables added to the instance returned by create (see below - baseObj).
     * For More detailed example see ReadMe.
     * ``` js
     * const BaseObj = {
     * create(props) { const baseObj = Object.create(BaseObj); return baseObj; } 
     * render() {...}
     * };
     * BaseObj.defaultProps = {...};
     * BaseObj.propTypes = {...};
     * BaseObj.getDerivedStateFromError = ...;
     * createReactComponent(BaseObj);
     * ```
     * For More detailed example see ReadMe.
     * @param {React.Component<P, S>} objectToWrap The object to create a React.Component from. The object will have a create function to initialize the react instance. return null if you don't need inheritance.
     * @param options the options to use when creating react class.
     */
    createReactComponent<P, S = {}>(objectToWrap: React.Component<P, S>, options: Options) : ClassicComponentClass<P>;

    /**
     * @description Create a Pure React Component using an Object.
     * @see https://reactjs.org/docs/react-api.html#reactpurecomponent
     *
     * Usage:
     * 
     * You can use 'this' in create to set the instance created by react.
     * 'Create' returns an obj whos' functions we'll bind to the react instance.
     * We'll also assign all variables added to the instance returned by create (see below - baseObj).
     * For More detailed example see ReadMe.
     * ``` js
     * const BaseObj = {
     * create(props) { } 
     * render() {}
     * };
     * BaseObj.propTypes = {...};
     * BaseObj.getDerivedStateFromError = ...;
     * createReactPure(BaseObj);
     * ```
     * @param {React.PureComponent<P, S> & { create: () => {}}} objectToWrap The object to create a React.PureComponent from. The object will have a create function to initialize the react instance. return null if you don't need inheritance.
     * @param options the options to use when creating react class.
     */
    createReactPure<P, S = {}>(objectToWrap: React.PureComponent<P, S>, options: Options): ClassicComponentClass<P>;
  }

  export = CreateReact;
}


