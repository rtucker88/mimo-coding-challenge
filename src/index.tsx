import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {saveCompletedLesson} from './services/database';

ReactDOM.render(
  <App saveLesson={saveCompletedLesson} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
