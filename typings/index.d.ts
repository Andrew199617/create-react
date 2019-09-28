
/**
* @description Public facing class.
* @type {LGDType}
*/
declare interface LGDType {
	/**
  * @description Polyfill Object with super to be able to use super when using OLOO.
  */
	polyfill(): any;

	/**
   * @description Assign and Object the same as Object.Assign but works with getters, setters and inheritance.
   * @param {Object} target The target object we are inheriting from gets modified in place.
   * @param {Object[]} sources The objects to to apply
   * @returns {Object} The new object.
   */
	ObjectAssign(target: Object, ...sources: any): Object;
}
