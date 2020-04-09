
declare module '@learngamedevelopment/oloo' {

  /**
  * @description Public facing class.
  * @type {LGDType}
  */
  const LGDType: {
    /**
    * @description Create the global variable that will be used for Oloo.
    */
    setup(): void;

    Oloo: OlooConstructor;
  }

  export = LGDType;
}


