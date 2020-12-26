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
      this.withSpaces = 0
    }

    componentDidMount(){
      let self = this
      $(document).on('click', '.btn-delete-line', function(){
        $(this).parent().remove()
        $("#drop-spaces-zone").css('display', 'inline-block')
      })
      let element1 = document.getElementById("space-draggable-horizontal-80-120")
      let element2 = document.getElementById("space-draggable-vertical-80-120")
      let element3 = document.getElementById("space-draggable-horizontal-100-120")
      let element4 = document.getElementById("space-draggable-vertical-100-120")
      this.initDraggable(element1)
      this.initDraggable(element2)
      this.initDraggable(element3)
      this.initDraggable(element4)
      let element5 = document.getElementById("drop-spaces-zone")
      this.initDropZone(element5)
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
      dropZone.addEventListener("drop", (ev) => {
        this.dropElement(ev)
      });
    }

    dragenter(e){
      console.log('dragenter')
      e.preventDefault()
    }

    dragover(e){
      console.log('dragover')
      e.preventDefault()
      $("#drop-spaces-zone").css('background-color', 'yellow')
    }

    dragleave(e){
      console.log('dragleave')
      e.preventDefault()
      $("#drop-spaces-zone").css('background-color', 'transparent')
    }

    createNemElement(ev, ){
      let newElem = this.draggedElement.cloneNode(true)
        $(".space-draggable").each(function(){
          $(this).html("")
        })
      ev.target.appendChild(newElem)
    }

    dropElement(ev){

        let withSpaces = this.calculSpacesWidth()

        if($(ev.target).attr("class").indexOf('space-draggable') == -1){
          withSpaces = this.calculSpacesWidth()
          if(withSpaces <= 12.5){
          let spacesDraggable = $("#drop-spaces-zone").find('.space-draggable')
          let nbrSpaceDraggable = $("#drop-spaces-zone").find('.space-draggable').length
          // console.log(nbrSpaceDraggable)
          let validLine = false
            ev.preventDefault();
            if(nbrSpaceDraggable < 3){
              if(nbrSpaceDraggable == 0){ // Si la dropzone est vide on autorise le drop
                if(withSpaces <= 12.1){ // Si la largeur restante est inférieure ou égale à 12,1m
                  this.createNemElement(ev)
                }else{ // On refuse le drop si la largeur des palettes est supérieure à 12,1m et si la pallette à déposr est horizontale (parce qu'il n'y aura plus assez de place pour la poser)
                  if($(this.draggedElement).data('position') == 'vertical'){
                    console.log('vertical')
                    if(withSpaces <= 12.3){
                      this.createNemElement(ev)
                    }else{
                      if(withSpaces <= 12.5){
                        if($(this.draggedElement).data('size') == '80-120'){
                          this.createNemElement(ev)
                        }else{
                          this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette 100/120', true)
                          validLine = false
                        }
                      }else{
                        this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palette', true)
                        validLine = false
                      }
                    }
                  }else{
                    this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette horizontale', true)
                  }
                }
              }else if(nbrSpaceDraggable == 1){ // Si il n'y a qu'un seul élément dans la dropzone, on autorise le drop
                if($(spacesDraggable[0]).data('position') == 'vertical' || $(spacesDraggable[0]).data('size') == '100-120'){ // Si on a que un élément qui est vertical on valide la ligne
                  validLine = true
                }
                if($(this.draggedElement).data('size') == '100-120'){
                  validLine = true
                }
                if(withSpaces <= 12.1){
                  this.createNemElement(ev)
                }else{
                  if( $(this.draggedElement).data('position') == 'vertical' ){
                    if(withSpaces <= 12.3){
                      this.createNemElement(ev)
                    }else{
                      if(withSpaces <= 12.5){
                        if($(this.draggedElement).data('size') == '80-120'){
                          this.createNemElement(ev)
                        }else{
                          this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette 100/120', true)
                          validLine = false
                        }
                      }else{
                        this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palette', true)
                        validLine = false
                      }
                    }
                  }else{
                    validLine = false
                    this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette horizontale', true)
                  }
                }
              }else if(nbrSpaceDraggable == 2){ // Si il y a 2 éléments dans la dropzone
                let two80120Horizontal = true
                spacesDraggable.each(function(){
                  if($(this).data('size') != '80-120' && $(this).data('position') != 'horizontal'){
                    two80120Horizontal = false
                  }
                })
                if(two80120Horizontal){ // Si on a 2 éléments horizontaux validLine = true
                  console.log('On a 2 élément précédent')
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
                    this.createNemElement(ev)
                  }
              }
            }
            // Si ce drop est le dernier possible, on valide la ligne de drop
            if(validLine){
              this.validLine(ev)
            }
            $("#drop-spaces-zone").css('background-color', 'transparent')
          }else{
            this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palettes', true)
          }        
        }else{
          console.log("Pas de drop pour cet élément")
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
        let i = 0
        $(".drop-spaces-zone").each(function(){
          html += '<div class="drop-spaces-zone" id="drop-spaces-zone-'+i+'" style="border: 3px solid grey;"></span>'+$(this).html()+'</div>'
          i++
        })
        $("#block-spaces").html(html)
        newElement.innerHTML = ''
        this.initDropZone(newElement)

        console.log("width spaces = "+this.withSpaces)
        
        document.querySelector("#block-spaces").appendChild(newElement)
        newElement.setAttribute('id', 'drop-spaces-zone')
        $("#drop-spaces-zone").css('width', '63px')
        $('.btn-delete-line').each(function(){
          $(this).css('width', $(this).parent().css('width'))
          $(this).css('display', 'inline-block')
        })
        $("#drop-spaces-zone").append('<span class="btn-delete-line" style="display:none;"></span>')
        if(this.calculSpacesWidth() > 12.5){
          $("#drop-spaces-zone").css('display', 'none')
        }

      }

      this.updateSpaces()
    }

    calculSpacesWidth(){
      let withSpaces = 0
      $(".drop-spaces-zone").each(function(){
        if($(this).attr("id") != "drop-spaces-zone"){
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
        }

      })
      return withSpaces
    }

    updateSpaces(){
      let spaces = []
      let lineSpace = []
      $(".drop-spaces-zone").each(function(){
        if($(this).attr("id") != "drop-spaces-zone"){
          lineSpace = []
          $(this).find(".space-draggable").each(function(){
            let space = {}
            space.size = $(this).data('size')
            space.position = $(this).data('position')
            lineSpace.push(space)
          })
          spaces[$(this).attr("id").replace("drop-spaces-zone-", "")] = lineSpace
        }

      })
      this.props.updateSpaces(spaces)
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