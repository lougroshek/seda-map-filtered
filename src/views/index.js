import React from 'react'
import { Route, Link } from 'react-router-dom'
import Header from '../components/base/Header';
import MapView from './map'
import withRoot from '../withRoot';

const App = () => (
  <div className="app__container">
    <Header>
      <Link to="/">
        <img 
          alt="Logo" 
          src="https://via.placeholder.com/240x40?text=LOGO"
        />
      </Link>
    </Header>
    <main className="body">
      <Route exact path="/" component={ MapView } />
    </main>
  </div>
)

export default withRoot(App)