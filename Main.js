//Loading the whole map to canvas
function LoadMap(){ //I needed to put this fuckin piece of pain into LoadMap function because nobody updated Vanilla JS into a version where it is loading after the HTML is loaded 
    Canvas = document.querySelector('canvas');
    Context = Canvas.getContext("2d");
    ZoomMultiplier = 0.1;
    JSON_segments = []

    XYVector = [0, 0];
    ZoomBoolSet = false;
    OriginX = 0;
    OriginY = 0;
    Scale = 1;
    DefaultWidth = 1370
    DefaultHeight = 550
    VisibleHeight = DefaultHeight;
    VisibleWidth = DefaultWidth;

    //Loading Map Canvas
    var Map_Image = new Image();
    Map_Image.src = "./Map.jpg";
    Map_Image.onload = function(){
      Context.drawImage(Map_Image, 0, 0, 1920, 1080)
    }
  }

  function Zoom(Context, event){ 
    //event.preventDefault();
    var Scroll = event.deltaY < 0 ? 1 : -2;
    var Zoom = Math.exp(Scroll * ZoomMultiplier);

    Context.translate(OriginX, OriginY);

    //                      scale
    OriginX -= XYVector[0] / (Scale * Zoom) - XYVector[0] / Scale;
    OriginY -= XYVector[1] / (Scale * Zoom) - XYVector[1] / Scale;

    Context.scale(Zoom, Zoom);
    Context.translate(-OriginX, -OriginY);

    //Updating scale, width and height
    Scale *= Zoom;
    VisibleWidth = DefaultWidth / Scale;
    VisibleHeight = DefaultHeight / Scale;

    //Doesn´t seem to work
  }
  
  const NukeDict = {
    "Tzar Bomba (100Mt)": [6.1, 73, 91],
    "Castle Bravo": [3.7, 3.6, 34],
    "Fat Man": [0.13, 4.59, 5.42],
    "Tzar Bomba (50Mt)": [4.62, 3.14, 60]
  }

  //Setting Up the Canvas-Mouse onclick Function
  function CanvasListenerSetUp(){
    Canvas.addEventListener('mousedown', function(e) {getCursorPosition(Canvas, e);});
    Canvas.addEventListener("wheel", function(e) {Zoom(Context, e)})
  }
  
  function getCursorPosition(Canvas, event){
    setTimeout(function(){
      var Rectangle = Canvas.getBoundingClientRect();
      var Xpos = event.clientX - Rectangle.left;
      var Ypos = event.clientY - Rectangle.top;
    
      XYVector[0] = Xpos;
      XYVector[1] = Ypos; 
    
      //console.log("x " + Xpos + " y: " + Ypos)


    }, 100)

  }
  
  function Detonate(){
      var Selected_Bomb = document.getElementById("Bomb_Selection").value;
      
      
      
      alert("You have selected: " + Selected_Bomb);
      
      Context.beginPath();
      Context.arc(XYVector[0], XYVector[1], NukeDict[Selected_Bomb][2] * 0.027, 0, 2* Math.PI);
      Context.fillStyle = "orange";
      Context.fill();
      Context.stroke();
      Context.closePath();
      
      console.log(XYVector);
      for(var i = 0; i < JSON_segments.length; i++){
          for(var i2 = 0; i2 < JSON_segments[i].length; i2++){
              
              if(JSON_segments[i][i2][0] == Math.round(XYVector[0]) && JSON_segments[i][i2][1] == Math.round(XYVector[1])){
                  console.log(JSON_segments[i][i2]);
                  var Result = JSON_segments[i][i2];
                  var StartingPixel;
                  var EndingPixel;

                  //                           BOTTOM SEGMENT          RIGHT SEGMENT                LEFT SEGMENT                TOP SEGMENT
                  var Neighboring_Segments = [(i <= 5) ? 1 : 0, (i != 5 || i != 10) ? 1 : 0, (i != 1 || i != 6) ? 1 : 0, (i <= 6) ? 1 : 0
                  //                           DIAGONAL LEFT BOTTOM         DIAGONAL RIGHT BOTTOM      DIAGONAL RIGHT TOP            DIAGONAL LEFT TOP           
                                              (i <= 2 && i >= 5) ? 1 : 0, (i <= 4 && i >= 1) ? 1 : 0, (i >= 6 && i <= 10) ? 1 : 0, (i >= 7 && i <= 10) ? 1 : 0]

                  
                  for(var Neighbor_Iter = 0; Neighbor_Iter < Neighboring_Segments.length; Neighbor_Iter++){
                    if(Neighboring_Segments[Neighbor_Iter] == 1){
                      switch(Neighbor_Iter){
                        case 0: //BOTTOM SEGMENT
                          // Y Value of center pixel | radius of the specified nuclear bomb | segment | the segment width
                          if(JSON_segments[i][i2][1] + Math.round(NukeDict[Selected_Bomb][2]) > (i = 0) ? 0 : i * 540){ //if statement if the radius + Center pixel pos is bigger than the segment

                            /*
                            StartingPixel = JSON_segments[i][i2 - Math.round(NukeDict[Selected_Bomb][2] * 0.027)];
                            EndingPixel = JSON_segments[i + 1][i2 + JSON_segments[i][i2][0] + Math.round(NukeDict[Selected_Bomb][2]) - 384]; //Getting
                            */
                            console.log("Bottom")
                          }
                          
                        case 1: //RIGHT SEGMENT
                          // X Value of center pixel | radius of the specified nuclear bomb | segment | the segment width
                          if(JSON_segments[i][i2][0] + Math.round(NukeDict[Selected_Bomb][2]) > (i = 0) ? 0 : i * 384){

                            console.log("Right")
                          }
                          
                        case 2: //LEFT SEGMENT
                          // X Value of center pixel | radius of the specified nuclear bomb | segment | the segment width
                          if(JSON_segments[i][i2][0] - Math.round(NukeDict[Selected_Bomb][2]) < 0){

                            console.log("Left")
                          }
                          
  
                        case 3: //TOP SEGMENT
                          // Y Value of center pixel | radius of the specified nuclear bomb | segment | the segment width
                          if(JSON_segments[i][i2][1] - Math.round(NukeDict[Selected_Bomb][2]) < 0){

                            console.log("Top")
                          }
                        
                        /*
                        DIAGONAL NEIGHBORS
                        */
                        
                        case 4: //DIAGONAL LEFT BOTTOM
                          // Current X                  Radius                                    Current Y                 Radius
                          if(JSON_segments[i][i2][0] < Math.round(NukeDict[Selected_Bomb][2]) && JSON_segments[i][i2][1] < Math.round(NukeDict[Selected_Bomb][2])){

                            console.log("Left Bottom")
                          }
  
                        case 5: //DIAGONAL RIGHT BOTTOM
                          // Current X                  Radius                                    Current Y                 Radius
                          if(JSON_segments[i][i2][0] > 384 - Math.round(NukeDict[Selected_Bomb][2]) && JSON_segments[i][i2][1] < Math.round(NukeDict[Selected_Bomb][2])){
                            
                            console.log("Right Bottom")
                          }
  
                        case 6: //DIAGONAL RIGHT TOP
                          // Current X                  Radius                                    Current Y                 Radius
                          if(JSON_segments[i][i2][0] > 384 - Math.round(NukeDict[Selected_Bomb][2]) && JSON_segments[i][i2][1] > 540 - Math.round(NukeDict[Selected_Bomb][2])){
                            
                            console.log("Right Top")
                          }

  
                        case 7: // DIAGONAL LEFT TOP 
                          // Current X                  Radius                                    Current Y                 Radius
                          if(JSON_segments[i][i2][0] < Math.round(NukeDict[Selected_Bomb][2]) && JSON_segments[i][i2][1] > 540 - Math.round(NukeDict[Selected_Bomb][2])){
                           
                            console.log("Left Top")
                          }

                      }
                    }
                  }

                  if(JSON_segments[i][i2])

                  var StartingPixel = JSON_segments[i][i2 - Math.round(NukeDict[Selected_Bomb][2] * 0.027)];
                  var EndingPixel = JSON_segments[i][i2 + Math.round(NukeDict[Selected_Bomb][2] * 0.027)];
              }
          }
          
      }
      
      //Context.clearRect(20, 20, Canvas.width, Canvas.height)
      
      
      if(XYVector[0] === 0 || XYVector[1] === 0){
        alert("You haven´t selected the location of detonate yet!")
        return 0;
        //1370 550
        //20 005
        
        //0.068
        //0.027
      }
      
      
}


  function ZoomBool(){
    if(ZoomBoolSet == false){ZoomBoolSet = true}
    else{ZoomBoolSet = false}
  }

  function ReadJSON(){
    
    for(var i = 0; i < 10; i++){
      $.getJSON(`./DensityRender/JSON_segm/segm_${i}.json`, function(jsonInstance) {
        JSON_segments.append(jsonInstance["Arr"]);
      });
    }
    return promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("Resolved"), 1000)
    });
  }
  async function LoadingScreen(){
    var PageContent = document.getElementById("PageContent");
    var LoadingDiv = document.getElementById("LoadingDiv");
    
    PageContent.style.visibility = "hidden";
  
    let Result = await ReadJSON();
    if(Result = "Resolved"){
      PageContent.style.visibility = "visible";
      LoadingDiv.remove()
      console.log("Resolved!")
      console.log(JSON_segments)
      
    }
    
  }
