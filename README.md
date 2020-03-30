# LGD
Polyfill to allow you to use OLOO pattern properly in project. Check out VSC extensions by LearnGameDevelopment to have syntax highlighting for these polyfills.

# Why to use this module.
[Check out how this module works.](https://www.learngamedevelopment.net/blog/oloo(objectslinkingtootherobjects))

``` js

const { setup } = require('@learngamedevelopment/oloo');
setup();

const Object1 = {
  create() {
    const object1 = Object.create(Object1);
    return object1;
  },

  virtualMethod() {
    console.log('Base Class!');
  }
}

const Object2 = {
  create() {
    const object2 = Oloo.assign(Object1.create(), Object2);
    return object2;
  },

  virtualMethod() {
    Oloo.base(this, this.virtualMethod);
    // could also use this.super.super if i inherited one more class.
    console.log('Inherited Class!');
  }
}

const object2Instance = Object2.create();
object2Instance.virtualMethod();
// Base Class!
// Inherited Class!


```