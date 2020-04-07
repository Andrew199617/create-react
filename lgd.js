function red(str) {
  return `\x1b[31m${str}\x1b[0m`;
}

/**
 * @description Helps with implementing Objects Linked to Other Objects Pattern. No need for this bindings. Also lets you keep your getters and setters as apposed to using Objects.assign. 
 * @see https://www.learngamedevelopment.net/blog/oloo(objectslinkingtootherobjects)
 * @class OlooConstructor
 */
const Oloo = {
  /**
   * @description Helps keep track of what level we are for a function. This way we can always call the function with the intial instance but continually go down the chain of inheritance.
   */
  objectMap: new Map(),

  create: Object.create,

  createSlow(obj) {
    Oloo.assignSlow({}, obj);
  },

  assign(baseObj, obj) {
    const newObj = Object.create(obj);
    oldProto = baseObj.__proto__;
    baseObj.__proto__ = newObj.__proto__;
    baseObj.__proto__.__proto__ = oldProto;
    return baseObj;
  },
  
  assignWithSymbols(baseObj, obj) {
    baseObj = Oloo.assign(baseObj, obj);
    
    let descriptors = [];
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

  assignSlow(baseObj, obj) {
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

  base(obj, funcName, ...params) {
    funcName = typeof funcName === 'function' ? funcName.name : funcName;
    
    let parent = obj;

    let currentObjectInstance = Oloo.objectMap.get(obj);
    if(currentObjectInstance) {
      // Keeps track of how far down the inheritance tree we are for a give function. Start from scratch if we called a different function.
      obj = currentObjectInstance[funcName] || obj;
    }

    parent = Object.getPrototypeOf(obj);

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
    
    if(currentObjectInstance) {
      currentObjectInstance[funcName] = parent;
    }
    else {
      currentObjectInstance = { obj, [funcName]: parent };
      Oloo.objectMap.set(obj, currentObjectInstance);
    }

    if(!parent.hasOwnProperty(funcName)) {
      Oloo._base(obj, parent, funcName, ...params);
      return;
    }

    parent[funcName].bind(currentObjectInstance.obj)(...params);

    if(currentObjectInstance.obj) {
      Oloo.objectMap.delete(currentObjectInstance.obj);
    }
  },
  
  _base(objInstance, obj, funcName, ...params) {
    let parent = Object.getPrototypeOf(obj);

    while(!parent.hasOwnProperty(funcName)) {
      // Get parent that has func to call.
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
    
    let currentObjectInstance = Oloo.objectMap.get(objInstance);
    // Keeps track of last base class to call function.
    currentObjectInstance[funcName] = parent;

    parent[funcName].bind(currentObjectInstance.obj)(...params);

    if(currentObjectInstance.obj) {
      Oloo.objectMap.delete(currentObjectInstance.obj);
    }
  }
}

/**
* @description Public facing class.
* @type {LGDType}
*/
const LGD = {
  /**
  * @description Setup Oloo as a global varaible so you don't have to import it in every class.
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
  },

  Oloo
};

module.exports = LGD;