import React from 'react';

import styles from './app.module.scss';

import { Route, Link } from 'react-router-dom';
import { Help } from './help'

export function App() {
  return (
    <div className={styles.app}>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/help">Page 2</Link>
          </li>
        </ul>
      </div>
      <Route path="/" exact
        render={() => (
          <div>
            This is the generated root route.{' '}
            <Link to="/page-2">Click here for page 2.</Link>
          </div>
        )}
      />
      <Route path="/help" exact
        render={() => <Help/>}
      />
      {/* END: routes */}
    </div>
  );
}

export default App;
