import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Header from './components/layout/header.component.jsx';
import Footer from './components/layout/footer.component.jsx';
import NotesPage from './pages/private/notes.page.jsx';
import NotePage from './pages/private/note.page.jsx';
import ProfilePage from './pages/private/profile.page.jsx';
import TagsPage from './pages/private/tags.page.jsx';
import HomePage from './pages/public/home.page.jsx';
import RegisterPage from './pages/public/register.page.jsx';
import LoginPage from './pages/public/login.page.jsx';
import LogoutPage from './pages/private/logout.page.jsx';
import PrivateRoute from './components/routing/private-route.container.jsx';
import PublicRoute from './components/routing/public-route.container.jsx';

import AuthContext from './context/auth/auth.context.js';

import './App.css';

function App() {
  const authContext = useContext(AuthContext);
  const { refreshToken, refreshAccessToken } = authContext;

  useEffect(() => {
    if (refreshToken) {
      refreshAccessToken();
      const time15minutes = 15 * 60 * 1000;
      // const time15minutes = 5 * 1000;
      const refreshInterval = setInterval(() => refreshAccessToken(), time15minutes);
      return () => clearInterval(refreshInterval);
    }
    // eslint-disable-next-line
  }, [refreshToken]);

  return (
    <Router>
      <Header />
      <main>
        <Container className='col-sm-12 col-xl-10 offset-xl-1'>
          <Switch>
            <PrivateRoute path='/notes' component={NotesPage} />
            <PrivateRoute path='/note/:id' component={NotePage} />
            <PrivateRoute path='/profile' component={ProfilePage} />
            <PrivateRoute path='/tags' component={TagsPage} />
            <PrivateRoute path='/logout' component={LogoutPage} />
            <PublicRoute path='/register' component={RegisterPage} />
            <PublicRoute path='/login' component={LoginPage} />
            <PublicRoute path='/' component={HomePage} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;