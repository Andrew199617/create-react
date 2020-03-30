
declare interface OlooConstructor {
  /**
   * Creates an object that has the specified prototype or that has null prototype.
   * @param o Object to use as a prototype. May be null.
   */
  create(o: object | null): any;

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   */
  create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;

  /**
   * @template T, M
   * @description Assign an Object the same way that Object.Assign works but with getters, setters and inheritance. Does not assign Symbols for performance.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @param {M} obj The objects to to apply.
   * @returns {T & M} The new object.
   */
  assign<T, M>(baseObj: T, obj: M): T & M;

  /**
   * @template T, M
   * @description Assign an Object the same way that Object.Assign works but with getters, setters and inheritance.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @param {M} obj The objects to to apply.
   * @returns {T & M} The new object.
   */
  assignWithSymbols<T, M>(baseObj: T, obj: M): T & M;

  /**
   * @template T, M
   * @description Same as assign but in the format of C# with class followed by base class. Does not assign symbols for performance.
   * @param {M} obj The objects to to apply.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @returns {T & M} The new object.
   */
  extend<T, M>(obj: M, baseObj: T): T & M;

  /**
   * @template T, M
   * @description Same as assign but in the format of C# with class followed by base class. 
   * @param {M} obj The objects to to apply.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @returns {T & M} The new object.
   */
  extendWithSymbols<T, M>(obj: M, baseObj: T): T & M;

  /**
   * @description Call the base function of an object.
   * @template R
   * @param {{}} obj The object with the function.
   * @param {function(): R} func The function to call. Pass in using ObjectName.function or this.function.
   * @param {...any[]} params The paramaters to call the function with.
   * @returns {R} The return of the func you passed in.
   */
  base<R>(obj: {}, func: function(): R, ...params: any[]): R;

  /**
   * @description Call the base function of an object.
   * @template R
   * @param {{}} obj The object with the function.
   * @param {string} funcName String name of the function to call. 'functionName'.
   * @param {...any[]} params The paramaters to call the function with.
   */
  base(obj: {}, funcName: string, ...params: any[]);
}

declare var Oloo: OlooConstructor;
