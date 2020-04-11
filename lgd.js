const ReactClassInterface = require('./reactComponentDefault');
const ReactPureInterface = require('./reactPureDefault');
const React = require('react');
const factory = require('./createReactClass');

if(typeof React === 'undefined') {
  throw Error('create-react-class could not find the React object. If you are using script tags, '
      + 'make sure that React is being loaded before create-react-class.');
}

// Hack to grab NoopUpdateQueue from isomorphic React
let ReactNoopUpdateQueue = new React.Component().updater;

const createReactComponent = factory(
  React.Component,
  ReactClassInterface,
  ReactNoopUpdateQueue
);

ReactNoopUpdateQueue = new React.PureComponent().updater;

const createReactPure = factory(
  React.PureComponent,
  ReactPureInterface,
  ReactNoopUpdateQueue
);

module.exports = {
  createReactComponent,
  createReactPure
};