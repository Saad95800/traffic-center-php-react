import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavItem extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
        <div className={this.props.class}>
           <Link to={this.props.url}>
              <div className="display-flex-center">
                <div className={this.props.imgClassName} style={{textAlign: 'center'}}>{this.props.text}</div>
                <span style={{textAlign: 'center', fontSize: '16px', color: '#fff'}}>{this.props.namelink}</span>
              </div> 
            </Link>
        </div>
    );
  }
}
