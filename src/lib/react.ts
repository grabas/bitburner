import ReactNamespace from 'react/index';
import ReactDomNamespace from 'react-dom';

const cWindow = eval("window") as Window & typeof globalThis;
const cDocument = eval("document") as Document & typeof globalThis;

const scheduler = eval("window.scheduler") as typeof globalThis;

const React = cWindow.React as typeof ReactNamespace;
const ReactDOM = cWindow.ReactDOM as typeof ReactDomNamespace;

const useEffect = React.useEffect;
const useState = React.useState;
const useRef = React.useRef;

export default React;
export {
  cWindow,
  cDocument,
  scheduler,
  ReactDOM,
  useEffect,
  useState,
  useRef
}