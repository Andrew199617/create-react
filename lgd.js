function red(str) {
  return `\x1b[31m${str}\x1b[0m`;
}

const Oloo = {
  create: Object.create,

  /**
   * @template T, M
   * @description Assign an Object the same way that Object.Assign works but with getters, setters and inheritance.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @param {M} obj The objects to to apply.
   * @returns {T & M} The new object.
   */
  assign(baseObj, obj) {
    let createdPrototype = false;
  
    let descriptors = Object.keys(obj)
      .reduce((descriptors, key) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);

        if(typeof descriptor.get === 'undefined' && typeof obj[key] === 'function') {
          if(!createdPrototype) {
            createdPrototype = true;
            Object.setPrototypeOf(baseObj, Object.create(baseObj.__proto__));
          }
          baseObj.__proto__[key] = obj[key];
          return descriptors;
        }

        descriptors[key] = descriptor;
        return descriptors;
      }, {});

    Object.defineProperties(baseObj, descriptors);
    
    return baseObj;
  },
  
  assignWithSymbols(baseObj, obj) {
    let createdPrototype = false;

    let descriptors = Object.keys(obj)
      .reduce((descriptors, key) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);

        if(typeof descriptor.get === 'undefined' && typeof obj[key] === 'function') {
          if(!createdPrototype) {
            createdPrototype = true;
            Object.setPrototypeOf(baseObj, Object.create(baseObj.__proto__));
          }
          baseObj.__proto__[key] = obj[key];
          return descriptors;
        }

        descriptors[key] = descriptor;
        return descriptors;
      }, {});

    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(obj)
      .forEach(sym => {
        let descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });

    Object.defineProperties(baseObj, descriptors);
  
    return baseObj;
  },
  
  /**
   * @template T, M
   * @description Same as assign but in the format of C# with class followed by base class.
   * @param {M} obj The objects to to apply.
   * @param {T} baseObj The baseObj object we are inheriting from gets modified in place.
   * @returns {T & M} The new object.
   */
  extend(obj, baseObj) {
    return Oloo.assign(baseObj, obj);
  },
  
  extendWithSymbols(obj, baseObj) {
    return Oloo.assignWithSymbols(baseObj, obj);
  },

  base(obj, funcName, ...params) {
    funcName = typeof funcName === 'function' ? funcName.name : funcName;

    let parent = Object.getPrototypeOf(obj);

    while(!parent.hasOwnProperty(funcName)) {
      // Start with the first base object that has the function. This will also ignore the first base objects func if we are calling the method without base since that will be the function we are calling this from.
      parent = Object.getPrototypeOf(parent);
    }

    if(!obj.hasOwnProperty("__parent__")) {
      // We ignore the first prototype since that is still the same object.
      parent = Object.getPrototypeOf(parent);
    }

    if(!parent.hasOwnProperty("__parent__")) {
      Object.defineProperty(parent, '__parent__', {
        writable: false,
        configurable: false,
        enumerable: false,
        value: true
      })
    }

    if(!parent.hasOwnProperty(funcName)) {
      Oloo.base(parent, funcName, ...params);
      return;
    }

    parent[funcName](...params);
  }
}

/**
* @description Public facing class.
* @type {LGDType}
*/
const LGD = {
  /**
  * @description Create the global varaible that will be used for Oloo.
  */
  setup() {
    if(typeof window !== 'undefined') {
      window.Oloo = Oloo;
    }
    else if(typeof global !== 'undefined') {
      global.Oloo = Oloo;
    }
    else {
      console.error(red('Could not polyfill Oloo.'));
    }
  }
};

module.exports = LGD;