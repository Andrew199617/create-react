
declare module 'create-react' {

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
     * @param {obj} objectToWrap 
     */
    createReactComponent<obj>(objectToWrap: obj) : obj;

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
     * @param {obj} objectToWrap 
     */
    createReactPure<obj>(objectToWrap: obj) : obj;
  }

  export = CreateReact;
}


