import React, { Component } from 'react';
import $ from 'jQuery';

export default class Journey extends Component {

    constructor(props){
      super(props);
      this.state = {
          spaces: [],
          dropSpaceZone: null
      }
      this.draggedElement = null;
      
    }

    componentDidMount(){
      let self = this
      $(document).on('click', '.btn-delete-line', function(){
        $(this).parent().remove()

        $("#drop-spaces-zone").css('display', 'inline-block')
        // if($("#drop-spaces-zone").length == 0){
        //   console.log(self.dropSpaceZone)
        //   console.log(self.dropSpaceZone.cloneNode(true))
        //   let newElement = self.dropSpaceZone.cloneNode(true)
        //   newElement.setAttribute('id', 'drop-spaces-zone')
        //   document.querySelector("#block-spaces").appendChild(newElement)
        //   $("#drop-spaces-zone").css('width', '63px')
        //   $("#drop-spaces-zone").find(".btn-delete-line").css('display', 'none')
        //   self.initDropZone($("#drop-spaces-zone"))
        //   $('.btn-delete-line').each(function(){
        //     $(this).css('width', $(this).parent().css('width'))
        //     $(this).css('display', 'inline-block')
        //   })
        //   $("#drop-spaces-zone").append('<span class="btn-delete-line" style="display:none;"></span>')          
        // }

      })
      let element1 = document .getElementById("space-draggable-horizontal-80-120")
      let element2 = document .getElementById("space-draggable-vertical-80-120")
      let element3 = document .getElementById("space-draggable-horizontal-100-120")
      let element4 = document .getElementById("space-draggable-vertical-100-120")
      this.initDraggable(element1)
      this.initDraggable(element2)
      this.initDraggable(element3)
      this.initDraggable(element4)
      let element5 = document.getElementById("drop-spaces-zone")
      this.initDropZone(element5)
      // this.dropSpaceZone = element5.cloneNode(true)
    }

    initDraggable(draggable) {
      draggable.addEventListener("dragstart", (e) => {this.draggedElement = e.target});
      draggable.addEventListener("drag", () => {});
      draggable.addEventListener("dragend", () => {});
      draggable.setAttribute("draggable", "true");
  }

    initDropZone(dropZone) {
      dropZone.addEventListener("dragenter", this.dragenter.bind(this));
      dropZone.addEventListener("dragover", this.dragover.bind(this));
      dropZone.addEventListener("dragleave", this.dragleave.bind(this));
      dropZone.addEventListener("drop", this.dropElement.bind(this));
    }

    deleteDropZone(dropZone){
      dropZone.removeEventListener("dragenter", this.dragenter.bind(this))
      dropZone.removeEventListener("dragover", this.dragover.bind(this))
      dropZone.removeEventListener("dragleave", this.dragleave.bind(this))
      dropZone.removeEventListener("drop", this.dropElement.bind(this))
    }

    dragenter(e){
      e.preventDefault()
    }

    dragover(e){
      e.preventDefault()
    }

    dragleave(e){
      e.preventDefault()
    }

    dropElement(ev){

      // let dropSpacesZone = document.querySelector("#drop-spaces-zone")
      let spacesDraggable = $("#drop-spaces-zone").find('.space-draggable')
      let nbrSpaceDraggable = $("#drop-spaces-zone").find('.space-draggable').length
      console.log(nbrSpaceDraggable)
      let validLine = false
        ev.preventDefault();
        if(nbrSpaceDraggable < 3){
          if(nbrSpaceDraggable == 0){ // Si la dropzone est vide on autorise le drop
            ev.target.appendChild(this.draggedElement.cloneNode(true))
          }else if(nbrSpaceDraggable == 1){ // Si il n'y a qu'un seul élément dans la dropzone, on autorise le drop
            if($(spacesDraggable[0]).data('position') == 'vertical' || $(spacesDraggable[0]).data('size') == '100-120'){ // Si on a que un élément qui est vertical on valide la ligne
              validLine = true
            }
            ev.target.appendChild(this.draggedElement.cloneNode(true))
          }else if(nbrSpaceDraggable == 2){ // Si il y a 2 éléments dans la dropzone
            let two80120Horizontal = true
            spacesDraggable.each(function(){
              if($(this).data('size') != '80-120' && $(this).data('position') != 'horizontal'){
                two80120Horizontal = false
              }
            })
            if(two80120Horizontal){ // Si on a 2 éléments horizontaux validLine = true
              validLine = true
            }
              let hundred = false
              let positionOk = true
              spacesDraggable.each(function(){
                if($(this).data('size') == '100-120'){ // Si un des 2 élément est 100/120 on interdit le drop
                  hundred = true
                }
                if($(this).data('position') == 'vertical'){ // Si un des éléments est vertical on interdit le drop
                  positionOk = false
                }
              })
              if(hundred == false && positionOk == true && this.draggedElement.getAttribute('data-size') == '80-120'){ // Si les 2 éléments sont horizontaux et 80/120 et que l'élément à placer est 80/120 on autorise le drop
                ev.target.appendChild(this.draggedElement.cloneNode(true));
              }
          }
        }
        // Si ce drop est le dernier possible, on valide la ligne de drop
        if(validLine){
          this.validLine(ev)
        }

    }

    cleanLine(e){
      e.preventDefault()
      $("#drop-spaces-zone").find('.space-draggable').each(function(){
        $(this).remove()
      })
    }

    validLine(e){
      e.preventDefault()

      if($('#drop-spaces-zone').find('.space-draggable').length > 0){
        let newElement = document.querySelector("#drop-spaces-zone").cloneNode(true)
        let html = ''
        let i = 1
        $(".drop-spaces-zone").each(function(){
          html += '<div class="drop-spaces-zone" id="drop-spaces-zone-'+i+'" style="border: 3px solid grey;"></span>'+$(this).html()+'</div>'
          i++
        })
        $("#block-spaces").html(html)
        newElement.innerHTML = ''
        this.initDropZone(newElement)

        let withSpaces = this.calculSpacesWidth()
        console.log("width spaces = "+withSpaces)
        
        document.querySelector("#block-spaces").appendChild(newElement)
        newElement.setAttribute('id', 'drop-spaces-zone')
        $("#drop-spaces-zone").css('width', '63px')
        $('.btn-delete-line').each(function(){
          $(this).css('width', $(this).parent().css('width'))
          $(this).css('display', 'inline-block')
        })
        $("#drop-spaces-zone").append('<span class="btn-delete-line" style="display:none;"></span>')
      
        if(withSpaces > 12.110){
          $("#drop-spaces-zone").css('display', 'none')
        }

      }

    }

    calculSpacesWidth(){
      let withSpaces = 0
      $(".drop-spaces-zone").each(function(){
        console.log($(this).css('width'))
        switch($(this).css('width')){
          case '51px':
            withSpaces += 1
            break;
          case '63px':
            withSpaces += 1.2
            break;
          case '44px':
            withSpaces += 0.8
            break;
          default:
            break;
        }
      })
      return withSpaces
    }

    render() {
        return (
            <div className="col-12">
              <div className="row" style={{border: "3px solid black", minHeight: "130px"}}>
                <div className="col-6" style={{border: "3px solid black"}}>
                  <div className="text-center">Palettes 80/120</div>
                  <div className="row" style={{height: "100%"}}>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div className="space-draggable space-draggable-horizontal-80-120" id="space-draggable-horizontal-80-120" data-size="80-120" data-position="horizontal" draggable="true"></div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div className="space-draggable space-draggable-vertical-80-120" id="space-draggable-vertical-80-120" data-size="80-120" data-position="vertical" draggable="true"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6" style={{border: "3px solid black"}}>
                  <div className="text-center">Palettes 100/120</div>
                  <div className="row" style={{height: "100%"}}>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div className="space-draggable space-draggable-horizontal-100-120" id="space-draggable-horizontal-100-120" data-size="100-120" data-position="horizontal"></div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div className="space-draggable space-draggable-vertical-100-120" id="space-draggable-vertical-100-120" data-size="100-120" data-position="vertical"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="" onClick={(e) => {this.cleanLine(e)}} style={{display: 'inline-block', marginTop: '15px'}}>Vider la ligne</a>
              <a href="" onClick={(e) => {this.validLine(e)}} style={{display: 'inline-block', marginTop: '15px'}}>Valider la ligne</a>
              <div className="display-flex-center height100">
                <div className="flex-row width100" style={{minHeight: '100px'}}>
                  <div className="block-spaces" id="block-spaces" style={{marginRight: '-16px', height: '130px'}}>
                    <div className="drop-spaces-zone" id="drop-spaces-zone">
                      <span className="btn-delete-line"></span>
                    </div>
                  </div>
                  <div className="col-3 d-none d-sm-block" style={{flex: 2}}>
                    <img src="http://traffic-center.local/public/img/front-truck.png" />
                  </div>
                </div>
              </div>
              
            </div>
        );
      }
  
    }