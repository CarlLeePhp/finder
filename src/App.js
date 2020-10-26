import React, { Component, Fragment } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar';
import Search from './components/users/Search';
import Users from './components/users/Users';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    isClear: true,
    alert: null,
  }
  // async componentDidMount(){
    // this.setState({ loading: true });

    // const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    // const res = await axios.get('https://api.github.com/users',{
    //   headers: {
    //     Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`
    //   }
    // });

    // this.setState({ users: res.data, loading: false });
  // }

  // Search Github users
  searchUsers = async (text) => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/search/users?q=${text}`,{
      headers: {
        Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    });

    this.setState({ users: res.data.items, loading: false});
  }

  // Get single Github user
  getUser = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users/${username}`,{
      headers: {
        Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    });

    this.setState({ user: res.data, loading: false});
  }

  // Get users repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,{
      headers: {
        Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    });

    this.setState({ repos: res.data, loading: false});
  }

  // Clear users
  clearUsers = () => {
    this.setState({ users: [] })
  }

  // set alert
  setAlert = (msg, type) => {
    this.setState({ alert: {msg, type }}); //msg: msg, type: type
    setTimeout( () => this.setState({ alert: null}), 5000);
  }

  
  render(){
    return (
      <Router>
        <div className="App">
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} showClear={this.state.users.length > 0} 
                    setAlert={this.setAlert} />
                  <Users loading={this.state.loading} users={this.state.users} />
                </Fragment>
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => (
                <User { ...props } getUser={this.getUser}
                  getUserRepos={this.getUserRepos} user={this.state.user}
                  repos={this.state.repos} loading={this.state.loading}
                />
              )} />
            </Switch>
            
          </div>
          
        </div>
      </Router>
      
    );
  }
  
}

export default App;
