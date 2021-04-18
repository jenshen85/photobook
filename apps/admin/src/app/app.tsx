import React from 'react';

import styles from './app.module.scss';

import { Route, Link, Switch, Redirect } from 'react-router-dom';
import { Help } from './help'

export function App() {
  return (
    <div className={styles.app}>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/admin">Home</Link>
          </li>
          <li>
            <Link to="/admin/help">Page 2</Link>
          </li>
        </ul>
      </div>
      <Switch>
        <Route path="/admin" exact
          render={() => (
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          )}
        />
        <Route path="/admin/help" exact
          render={() => <Help/>}
        />
        <Route exact path="/">
          <Redirect to="/admin" />
        </Route>
      </Switch>
      {/* END: routes */}
    </div>
  );
}

export default App;
