 import React, { Component } from 'react';

export default class Logout extends Component {

  constructor(props){
    super(props);
    console.log(this.props.path)
  }

  render() {

    return (
        <div className="display-flex-center">Logout</div>
    );
  }
}
