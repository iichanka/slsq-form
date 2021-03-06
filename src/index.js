import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'
import Form from './containers/Form'
import './index.css';
import { LocaleProvider } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';


const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}



function ready(callback){
  // in case the document is already rendered
  if (document.readyState!='loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') callback();
  });
}


if (process.env.NODE_ENV === 'production') {
  document.domain = 'spk.ru';
}


export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);



render(
  <Provider store={store}>
    <LocaleProvider locale = { ru_RU } >
      <Form />
    </LocaleProvider>
  </Provider>,
  document.getElementById('customSLSQ')
);