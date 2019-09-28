function polyfill() {
  Object.defineProperty(
    Object.prototype,
    'super',
    {
      get() {
        let parent = Object.getPrototypeOf(this);
        if(!this.hasOwnProperty("__parent__")) {
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

        return parent;
      },
      enumerable: false,
      configurable: false
    })
}

function ObjectAssign(target, ...sources) {
  let createdPrototype = false;

  sources.forEach(source => {
    let descriptors = Object.keys(source)
      .reduce((descriptors, key) => {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);

        if(typeof descriptor.get === 'undefined' && typeof source[key] === 'function') {
          if(!createdPrototype) {
            createdPrototype = true;
            Object.setPrototypeOf(target, Object.create(target.__proto__));
          }
          target.__proto__[key] = source[key];
          return descriptors;
        }

        descriptors[key] = descriptor;
        return descriptors;
      }, {});

    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source)
      .forEach(sym => {
        let descriptor = Object.getOwnPropertyDescriptor(source, sym);
        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });

    Object.defineProperties(target, descriptors);
  });

  return target;
}

module.exports = { 
  polyfill, 
  ObjectAssign
};