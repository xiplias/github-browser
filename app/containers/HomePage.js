import React, { Component } from 'react';
import GitHub from 'github-api';
import WebView from 'react-electron-web-view';
import { Flex, Box } from 'reflexbox';
import List from '../components/List';


class App extends Component {
  constructor() {
    super();

    this.state = {
      repos: [],
      currentRepo: false
    };

    this.changeSelectedRepo = this.changeSelectedRepo.bind(this);
  }

  componentWillMount() {
    const that = this;
    const gh = new GitHub({
      token: '241bff843061fc627c8611252cf7c1e565b29c57'
    });

    const user = gh.getUser();
    user.listRepos((err, result) => {
      console.log(result);
      that.setState({
        repos: result
      });
    });
  }

  changeSelectedRepo(repo) {
    this.setState({
      currentRepo: repo
    });

    // var win = remote.getCurrentWindow();
    //
    // console.log(win)
    //
    // // now i have everything from BrowserWindow api...
    // win.setBounds({
    //      width: 1000
    // });
  }

  render() {
    return (
      <Flex gutter={0} justify="space-between">
        <Box col={2} p={3}>
          <List repos={this.state.repos} clickCallback={this.changeSelectedRepo} />
        </Box>
        <Box col={2} p={3}>
          <List repos={this.state.repos} clickCallback={this.changeSelectedRepo} />
        </Box>
        <Box col={8}>
          {this.state.currentRepo && <WebView src={this.state.currentRepo.html_url} className="webview" style={{ height: '100%' }} />}
        </Box>
      </Flex>
    );
  }
}

export default App;
