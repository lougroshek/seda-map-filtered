import React from 'react'
import { Route, Link } from 'react-router-dom'
import Header from '../components/base/Header';
import MapView from './map'
import withRoot from '../withRoot';

const App = () => (
  <div className="app-container">
    <Header>
      <Link to="/">Home</Link>
    </Header>
    <main className="body-wrapper">
      <Route exact path="/" component={MapView} />
    </main>
  </div>
)

export default withRoot(App)
