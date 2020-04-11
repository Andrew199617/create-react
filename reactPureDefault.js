/**
  * Composite components are higher-level components that compose other composite
  * or host components.
  *
  * To create a new type of `ReactClass`, pass a specification of
  * your new class to `React.createClass`. The only requirement of your class
  * specification is that you implement a `render` method.
  *
  *   var MyComponent = React.createClass({
  *     render: function() {
  *       return <div>Hello World</div>;
  *     }
  *   });
  *
  * The class specification supports a specific protocol of methods that have
  * special meaning (e.g. `render`). See `ReactClassInterface` for
  * more the comprehensive protocol. Any other properties and methods in the
  * class specification will be available on the prototype.
  *
  * @interface ReactClassInterface
  * @internal
  */
 const ReactPureInterface = {

   /**
    * An object containing properties and methods that should be defined on
    * the component's constructor instead of its prototype (static methods).
    *
    * @type {object}
    * @optional
    */
   statics: 'DEFINE_MANY',

   /**
    * Definition of prop types for this component.
    *
    * @type {object}
    * @optional
    */
   propTypes: 'DEFINE_MANY',

   /**
    * Definition of context types for this component.
    *
    * @type {object}
    * @optional
    */
   contextTypes: 'DEFINE_MANY',

   /**
    * Definition of context types this component sets for its children.
    *
    * @type {object}
    * @optional
    */
   childContextTypes: 'DEFINE_MANY',

   /**
    * Uses props from `this.props` and state from `this.state` to render the
    * structure of the component.
    *
    * No guarantees are made about when or how often this method is invoked, so
    * it must not have side effects.
    *
    *   render: function() {
    *     var name = this.props.name;
    *     return <div>Hello, {name}!</div>;
    *   }
    *
    * @return {ReactComponent}
    * @required
    */
   render: 'DEFINE_ONCE',

   // ==== Delegate methods ====

   /**
    * Invoked when the component is initially created and about to be mounted.
    * This may have side effects, but any external subscriptions or data created
    * by this method must be cleaned up in `componentWillUnmount`.
    *
    * @optional
    */
   componentWillMount: 'DEFINE_MANY',

   /**
    * Invoked when the component has been mounted and has a DOM representation.
    * However, there is no guarantee that the DOM node is in the document.
    *
    * Use this as an opportunity to operate on the DOM when the component has
    * been mounted (initialized and rendered) for the first time.
    *
    * @param {DOMElement} rootNode DOM element representing the component.
    * @optional
    */
   componentDidMount: 'DEFINE_MANY',

   /**
    * Invoked before the component receives new props.
    *
    * Use this as an opportunity to react to a prop transition by updating the
    * state using `this.setState`. Current props are accessed via `this.props`.
    *
    *   componentWillReceiveProps: function(nextProps, nextContext) {
    *     this.setState({
    *       likesIncreasing: nextProps.likeCount > this.props.likeCount
    *     });
    *   }
    *
    * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
    * transition may cause a state change, but the opposite is not true. If you
    * need it, you are probably looking for `componentWillUpdate`.
    *
    * @param {object} nextProps
    * @optional
    */
   componentWillReceiveProps: 'DEFINE_MANY',

   /**
    * Invoked when the component is about to update due to a transition from
    * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
    * and `nextContext`.
    *
    * Use this as an opportunity to perform preparation before an update occurs.
    *
    * NOTE: You **cannot** use `this.setState()` in this method.
    *
    * @param {object} nextProps
    * @param {?object} nextState
    * @param {?object} nextContext
    * @param {ReactReconcileTransaction} transaction
    * @optional
    */
   componentWillUpdate: 'DEFINE_MANY',

   /**
    * Invoked when the component's DOM representation has been updated.
    *
    * Use this as an opportunity to operate on the DOM when the component has
    * been updated.
    *
    * @param {object} prevProps
    * @param {?object} prevState
    * @param {?object} prevContext
    * @param {DOMElement} rootNode DOM element representing the component.
    * @optional
    */
   componentDidUpdate: 'DEFINE_MANY',

   /**
    * Invoked when the component is about to be removed from its parent and have
    * its DOM representation destroyed.
    *
    * Use this as an opportunity to deallocate any external resources.
    *
    * NOTE: There is no `componentDidUnmount` since your component will have been
    * destroyed by that point.
    *
    * @optional
    */
   componentWillUnmount: 'DEFINE_MANY',

   /**
    * Replacement for (deprecated) `componentWillMount`.
    *
    * @optional
    */
   UNSAFE_componentWillMount: 'DEFINE_MANY',

   /**
    * Replacement for (deprecated) `componentWillReceiveProps`.
    *
    * @optional
    */
   UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

   /**
    * Replacement for (deprecated) `componentWillUpdate`.
    *
    * @optional
    */
   UNSAFE_componentWillUpdate: 'DEFINE_MANY',

   // ==== Advanced methods ====

   /**
    * Updates the component's currently mounted DOM representation.
    *
    * By default, this implements React's rendering and reconciliation algorithm.
    * Sophisticated clients may wish to override this.
    *
    * @param {ReactReconcileTransaction} transaction
    * @internal
    * @overridable
    */
   updateComponent: 'OVERRIDE_BASE'
 };

 module.exports = ReactPureInterface;