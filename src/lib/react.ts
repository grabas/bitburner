import ReactNamespace from 'react/index';
import ReactDomNamespace from 'react-dom';

const cWindow = eval("window") as Window & typeof globalThis;
const cDocument = eval("document") as Document & typeof globalThis;

const React = cWindow.React as typeof ReactNamespace;
const ReactDOM = cWindow.ReactDOM as typeof ReactDomNamespace;

export default React;
export {
  cWindow,
  cDocument,
  ReactDOM
}