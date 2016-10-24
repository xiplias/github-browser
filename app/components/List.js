import React, { Component } from 'react';
import ListItem from './ListItem';

class List extends Component {
  static propTypes = {
    repos: React.PropTypes.array,
    clickCallback: React.PropTypes.func
  }

  render() {
    return (
      <div className="List">
        {this.props.repos.map((repo) => {
          return (<ListItem onClick={() => this.props.clickCallback(repo)} key={repo.id}>{repo.name}</ListItem>)
        })}
      </div>
    );
  }
}

export default List;
