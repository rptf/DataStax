import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PageQRCode from './PageQRCode';
import PageReceipt from './PageReceipt';
import PageList from './PageList';
import PageReceiptView from './PageReceiptView';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={PageQRCode} />
      <Route path="/qrcode" component={PageQRCode} />

      <Route path="/receipt/:param" component={PageReceipt} />

      <Route path="/list" component={PageList} />
      
      <Route path="/view/:documentId" component={PageReceiptView} />

    </Switch>
  </BrowserRouter>
);

export default Routes;