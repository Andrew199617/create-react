
declare module '@mavega/react' {

  import { ClassicComponentClass } from "react";

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
     * render() {}
     * };
     * BaseObj.defaultProps = {};
     * BaseObj.propTypes = {};
     * createReactComponent(BaseObj);
     * ```
     * For More detailed example see ReadMe.
     * @param {React.Component<P, S>} objectToWrap The object to create a React.Component from. The object will have a create function to initialize the react instance. return null if you don't need inheritance.
     */
    createReactComponent<P, S = {}>(objectToWrap: React.Component<P, S>) : ClassicComponentClass<P>;

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
     * create(props) { return BaseObj; } 
     * render() {}
     * };
     * BaseObj.propTypes = {};
     * createReactPure(BaseObj);
     * ```
     * @param {React.PureComponent<P, S> & { create: () => {}}} objectToWrap The object to create a React.PureComponent from. The object will have a create function to initialize the react instance. return null if you don't need inheritance.
     */
    createReactPure<P, S = {}>(objectToWrap: React.PureComponent<P, S>): ClassicComponentClass<P>;
  }

  export = CreateReact;
}


