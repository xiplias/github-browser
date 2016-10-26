import React from 'react';
import { Flex, Box } from 'reflexbox';
import { Input, Button, Panel, PanelHeader } from 'rebass';

const localStorage = global.window.localStorage;

class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      token: '',
    };

    this.setAuth = this.setAuth.bind(this);
    this.submitAuth = this.submitAuth.bind(this);
  }

  setAuth(e) {
    this.setState({ token: e.currentTarget.value });
  }

  submitAuth() {
    localStorage.token = this.state.token;
    this.props.authSuccessCallback()
  }

  render() {
    return (
      <Flex align="center" justify="center" style={{ marginTop: '10%' }}>
        <Box>
          <Panel theme="default" style={{ minWidth: '400px' }}>
            <PanelHeader inverted theme="default">
              Set Auth Token
            </PanelHeader>
            <Input
              label="Token"
              name="token"
              placeholder="personal auth token"
              rounded
              type="text"
              onChange={this.setAuth}
            />
            <Button
              backgroundColor="primary"
              color="white"
              inverted
              rounded
              onClick={this.submitAuth}
            >
              Save
            </Button>
          </Panel>
        </Box>
      </Flex>
    );
  }
}

export default Login;
