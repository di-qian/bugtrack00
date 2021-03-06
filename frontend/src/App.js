import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import TesterMessageToast from './components/TesterMessageToast';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import BugEditScreen from './screens/BugEditScreen';
import BugCreateScreen from './screens/BugCreateScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserCreateScreen from './screens/UserCreateScreen';
import ProjectCreateScreen from './screens/ProjectCreateScreen';
import ProjectListScreen from './screens/ProjectListScreen';
import ProjectEditScreen from './screens/ProjectEditScreen';
import NoMatch from './screens/404Page';
import NotAuthorized from './screens/401Page';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col xs sm="4" md="3" lg="2" className="mr-auto">
              <TesterMessageToast />
            </Col>
            <Col sm="4" md="6" lg="7">
              <Switch>
                <Route path="/login" component={LoginScreen} />
                <Route path="/register" component={RegisterScreen} />
                <Route path="/auth/profile" component={ProfileScreen} />
                <Route path="/auth/bug/create" component={BugCreateScreen} />
                <Route
                  path="/auth/bug/edit/:id"
                  component={BugEditScreen}
                  exact
                />
                <Route
                  path="/admin/project/create"
                  component={ProjectCreateScreen}
                />
                <Route
                  path="/admin/projectlist/page/:pageNumber"
                  component={ProjectListScreen}
                  exact
                />
                <Route
                  path="/admin/projectlist"
                  component={ProjectListScreen}
                  exact
                />
                <Route
                  path="/admin/project/:id/edit"
                  component={ProjectEditScreen}
                />
                <Route
                  path="/admin/userlist/page/:pageNumber"
                  component={UserListScreen}
                  exact
                />
                <Route
                  path="/admin/userlist"
                  component={UserListScreen}
                  exact
                />
                <Route path="/admin/user/create" component={UserCreateScreen} />
                <Route path="/admin/user/:id/edit" component={UserEditScreen} />

                <Route
                  path="/auth/dashboard/page/:pageNumber"
                  component={DashboardScreen}
                  exact
                />

                <Route
                  path="/auth/dashboard"
                  component={DashboardScreen}
                  exact
                />
                <Route path="/auth/fail" component={NotAuthorized} exact />
                <Route path="/" component={HomeScreen} exact />

                <Route component={NoMatch} />
              </Switch>
            </Col>
            <Col xs sm="4" md="3" lg="2" className="mr-auto"></Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
