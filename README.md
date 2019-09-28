# LGD
Polyfill to allow you to use OLOO pattern properly in project. Check out VSC extensions by LearnGameDevelopment to have syntax highlighting for these polyfills.

[Check out how this module works.](https://www.learngamedevelopment.net/blog/oloo(objectslinkingtootherobjects))

``` js

const { ObjectAssign, polyfill } = require('@learngamedevelopment/oloo');
polyfill();

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
    const object2 = ObjectAssign(Object1.create(), Object2);
    return object2;
  },

  virtualMethod() {
    this.super.virtualMethod();
    // could also use this.super.super if i inherited one more class.
    console.log('Inherited Class!');
  }
}

const object2Instance = Object2.create();
object2Instance.virtualMethod();


```