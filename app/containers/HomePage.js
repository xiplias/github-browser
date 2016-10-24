import React, { Component } from 'react';
import GitHub from 'github-api';
import WebView from 'react-electron-web-view';
import { Flex, Box } from 'reflexbox';
import TimeAgo from 'react-timeago';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Login from './Login';

const localStorage = global.window.localStorage;

class App extends Component {
  constructor() {
    super();

    this.state = {
      repos: false,
      issues: false,
      currentPullRequests: [],
      currentRepo: false,
      currentIssue: false,
      currentUrl: false,
      token: localStorage.token
    };

    this.setSelectedRepo = this.setSelectedRepo.bind(this);
    this.setSelectedIssue = this.setSelectedIssue.bind(this);
    this.authSuccessCallback = this.authSuccessCallback.bind(this);
  }

  componentWillMount() {
    this.fetchRepos();
  }

  setSelectedRepo(repo) {
    this.setState({
      currentUrl: repo.html_url,
      currentRepo: repo,
      currentIssue: false,
      issues: false,
    });

    this.fetchIssues(repo);
  }

  setSelectedIssue(issue) {
    this.setState({
      currentUrl: issue.html_url,
      currentIssue: issue
    });
  }

  fetchIssues(repo) {
    const that = this;

    if (this.state.token) {
      new GitHub({
        token: this.state.token,
      }).getIssues(repo.owner.login, repo.name).listIssues({}, (err, result) => {
        that.setState({
          issues: result
        });
      });
    }
  }

  fetchRepos() {
    const that = this;

    if (this.state.token) {
      new GitHub({
        token: this.state.token,
      }).getUser().listRepos((err, result) => {
        that.setState({
          repos: result
        });
      });
    }
  }

  authSuccessCallback() {
    this.setState({
      token: localStorage.token
    });
    this.fetchRepos();
  }

  render() {
    if (!localStorage.token) {
      return (
        <Login authSuccessCallback={this.authSuccessCallback} />
      );
    }

    const sortedRepos = (this.state.repos || []).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return (
      <Flex gutter={0} justify="space-between">
        <Box col={2}>
          <List>
            {this.state.repos && sortedRepos.map((repo) => (
              <ListItem
                onClick={() => this.setSelectedRepo(repo)}
                key={repo.id}
                className={this.state.currentRepo && repo.id === this.state.currentRepo.id && 'selected'}
              >
                {repo.owner.login}/{repo.name}
                <br />
                <small>Updated <TimeAgo date={repo.updated_at} /></small>
              </ListItem>
            ))}
            {!this.state.repos && <Box pt={4}><center>Loading</center></Box>}
          </List>
        </Box>
        {this.state.currentRepo && (
          <Box col={2}>
            <List>
              {(this.state.issues || []).map((issue) => (
                <ListItem
                  onClick={() => this.setSelectedIssue(issue)}
                  key={issue.id}
                  className={this.state.currentIssue && issue.id === this.state.currentIssue.id && 'selected'}
                >
                  {issue.title}
                  <br />
                  <small>#{issue.number} opened <TimeAgo date={issue.created_at} /></small>
                </ListItem>
              ))}
              {this.state.issues.length === 0 && <Box pt={4}><center>No Issues</center></Box>}
              {!this.state.issues && <Box pt={4}><center>Loading</center></Box>}
            </List>
          </Box>
        )}
        <Box col={8}>
          {this.state.currentRepo && <WebView src={this.state.currentUrl} className="webview" style={{ height: '100%' }} />}
        </Box>
      </Flex>
    );
  }
}

export default App;
