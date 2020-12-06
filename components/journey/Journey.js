import React, { Component } from 'react';

export default class Journey extends Component {

    constructor(props){
      super(props);
      this.state = {
          spaces: this.props.spaces
      }
    }

    changeAvailability(index){
        let newSpaces = this.state.spaces;
        if(newSpaces[index].is_empty == 1){
            newSpaces[index].is_empty = 0;
        }else{
            newSpaces[index].is_empty = 1
        }
        this.setState({spaces: newSpaces})
    }

    render() {

        let spaces = this.state.spaces;
        spaces.map( (space, index) => {
            if(space.is_empty == 1){
                space.color = '#00de00';
            }else{
                space.color = '#ff5e5e';
            }
        });
        console.log(spaces);
        console.log(spaces[0]);
        console.log(spaces[0].color);
        return (
            <div className="col-md-8">
                      <div className="display-flex-center height100">
                        <div className="row width100" style={{minHeight: '100px'}}>
                          <div className="col-7" style={{marginRight: '-16px', height: '130px'}}>
                            <div className="block-line-squares">
                              <div className="little-square" onClick={() => {this.changeAvailability(0)}} style={{backgroundColor: spaces[0].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(1)}} style={{backgroundColor: spaces[1].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(2)}} style={{backgroundColor: spaces[2].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(3)}} style={{backgroundColor: spaces[3].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(4)}} style={{backgroundColor: spaces[4].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(5)}} style={{backgroundColor: spaces[5].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(6)}} style={{backgroundColor: spaces[6].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(7)}} style={{backgroundColor: spaces[7].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(8)}} style={{backgroundColor: spaces[8].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(9)}} style={{backgroundColor: spaces[9].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(10)}} style={{backgroundColor: spaces[10].color}}></div>
                            </div>
                            <div className="block-line-squares">
                              <div className="little-square" onClick={() => {this.changeAvailability(11)}} style={{backgroundColor: spaces[11].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(12)}} style={{backgroundColor: spaces[12].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(13)}} style={{backgroundColor: spaces[13].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(14)}} style={{backgroundColor: spaces[14].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(15)}} style={{backgroundColor: spaces[15].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(16)}} style={{backgroundColor: spaces[16].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(17)}} style={{backgroundColor: spaces[17].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(18)}} style={{backgroundColor: spaces[18].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(19)}} style={{backgroundColor: spaces[19].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(20)}} style={{backgroundColor: spaces[20].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(21)}} style={{backgroundColor: spaces[21].color}}></div>
                            </div>
                            <div className="block-line-squares">
                              <div className="little-square" onClick={() => {this.changeAvailability(22)}} style={{backgroundColor: spaces[22].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(23)}} style={{backgroundColor: spaces[23].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(24)}} style={{backgroundColor: spaces[24].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(25)}} style={{backgroundColor: spaces[25].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(26)}} style={{backgroundColor: spaces[26].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(27)}} style={{backgroundColor: spaces[27].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(28)}} style={{backgroundColor: spaces[28].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(29)}} style={{backgroundColor: spaces[29].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(30)}} style={{backgroundColor: spaces[30].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(31)}} style={{backgroundColor: spaces[31].color}}></div>
                              <div className="little-square" onClick={() => {this.changeAvailability(32)}} style={{backgroundColor: spaces[32].color}}></div>
                            </div>
                          </div>
                          <div className="col-3">
                            <img src="http://traffic-center.local/public/img/front-truck.png" />
                          </div>
                        </div>
                      </div>
                    </div>
        );
      }
  
    }