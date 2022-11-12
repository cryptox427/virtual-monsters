import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/fonts/Futura Bold font.ttf'
import './assets/fonts/Futura Book font.ttf'
import './assets/fonts/Futura Extra Black font.ttf'
import './assets/fonts/Futura Heavy font.ttf'
import './assets/fonts/Futura Light font.ttf'
import './assets/fonts/Futura Medium Italic font.ttf'
import './assets/fonts/Futura XBlk BT.ttf'

ReactDOM.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
