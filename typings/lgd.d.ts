
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
     * ``` js
     * const obj = Object.create({});
     * obj.state = { example: 0 };
     * createReactComponent(obj);
     * ```
     * For More detailed example see ReadMe.
     * @param {React.Component<P, S>} objectToWrap The object to create a React.Component from.
     */
    createReactComponent<P, S = {}>(objectToWrap: React.Component<P, S>) : ClassicComponentClass<P>;

    /**
     * @description Create a Pure React Component using an Object.
     * @see https://reactjs.org/docs/react-api.html#reactpurecomponent
     *
     * Usage:
     * ``` js
     * const obj = Object.create({});
     * createReactComponent(obj);
     * ```
     * For More detailed example see ReadMe.
     * @param {React.PureComponent<P, S>} objectToWrap The object to create a React.PureComponent from.
     */
    createReactPure<P, S = {}>(objectToWrap: React.PureComponent<P, S>): ClassicComponentClass<P>;
  }

  export = CreateReact;
}


