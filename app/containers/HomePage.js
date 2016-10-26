import React, { Component } from 'react';
import GitHub from 'github-api';
import WebView from 'react-electron-web-view';
import { Flex, Box } from 'reflexbox';
import TimeAgo from 'react-timeago';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Login from './Login';
import Header from '../components/Header';


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
    this.fetchRepos(this.state.token);
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

  fetchRepos(token) {
    const that = this;

    if (token) {
      new GitHub({
        token,
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
    this.fetchRepos(localStorage.token);
  }

  render() {
    if (!localStorage.token) {
      return (
        <Login authSuccessCallback={this.authSuccessCallback} />
      );
    }

    const sortedRepos = (this.state.repos || []).sort((a, b) => (
      new Date(b.updated_at) - new Date(a.updated_at)
    ));

    return (
      <Flex gutter={0} justify="space-between">
        <Box col={2}>
          <Header>Repos</Header>
          <List>
            {this.state.repos && sortedRepos.map((repo) => (
              <ListItem
                onClick={() => this.setSelectedRepo(repo)}
                key={repo.id}
                className={this.state.currentRepo && repo.id === this.state.currentRepo.id && 'selected'}
              >
                <Flex>
                  <Box pr={1}>
                    {repo.private ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z" /></svg>
                    )}
                  </Box>
                  <Box>
                    {repo.owner.login}/{repo.name}
                    <br />
                    <small>Updated <TimeAgo date={repo.updated_at} /></small>
                  </Box>
                </Flex>
              </ListItem>
            ))}
            {!this.state.repos && <Box pt={4}><center>Loading</center></Box>}
          </List>
        </Box>
        {this.state.currentRepo && (
          <Box col={2}>
            <Header>Issues & PR</Header>
            <List>
              {(this.state.issues || []).map((issue) => (
                <ListItem
                  onClick={() => this.setSelectedIssue(issue)}
                  key={issue.id}
                  className={this.state.currentIssue && issue.id === this.state.currentIssue.id && 'selected'}
                >
                  <Flex>
                    <Box pr={1}>
                      {issue.pull_request ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z" /></svg>
                      )}
                    </Box>
                    <Box>
                      {issue.title}
                      <br />
                      <small>#{issue.number} opened <TimeAgo date={issue.created_at} /></small>
                    </Box>
                  </Flex>
                </ListItem>
              ))}
              {this.state.issues.length === 0 && <Box pt={4}><center>No Issues</center></Box>}
              {!this.state.issues && <Box pt={4}><center>Loading</center></Box>}
            </List>
          </Box>
        )}
        <Box col={8}>
          {this.state.currentRepo && (
            <div style={{ height: '100%' }}>
              <Header>{this.state.currentUrl}</Header>
              <WebView src={this.state.currentUrl} className="webview" style={{ height: '100%' }} />
            </div>
          )}
        </Box>
      </Flex>
    );
  }
}

export default App;
