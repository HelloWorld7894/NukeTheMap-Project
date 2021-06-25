document.addEventListener("DOMContentLoaded", function(){
  LoadMap()
  CanvasListenerSetUp()
  LoadingScreen()
});

//Loading the whole map to canvas
function LoadMap(){ //I needed to put this fuckin piece of pain into LoadMap function because nobody updated Vanilla JS into a version where it is loading after the HTML is loaded 
  Canvas = document.querySelector('canvas');
  Context = Canvas.getContext("2d");
  ZoomMultiplier = 0.1;
  JSON_segments = []
  Result_Array = []
  Hidden_Operation = []

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

    /*
    Put Code from StartingEndingPoint.js if you are retarded
    */

    /*
    CALCULATING CAUSALTIES BY GETTING ALL PIXELS IN THE BOMB RADIUS
    */

    var Image = Context.getImageData(0, 0, Canvas.width, Canvas.height)
    var Image_Data = Image.data; //enumerates all pixels in the context

    for(var i = 0; i < Image_Data.length; i += 4){
      // Red                      Green                       Blue
      if(Image_Data[i] == 255 && Image_Data[i + 1] == 165 && Image_Data[i + 2] == 0){Hidden_Operation.push(i / 4)}
    }

    Hidden_Operation.forEach(Element => {
      var Operator = (Element - (Element % 207360)) / 207360
      Result_Array.push(JSON_segments[Operator][Element % 207360][2])
    })

    console.log(Result_Array)
    console.log(Hidden_Operation)
    var Pop_Sum = 0;
  
    Result_Array.forEach(Pop => {
      Pop_Sum += Pop;
    });
  
    console.log(Pop_Sum)
    Hidden_Operation = [] //Converts Array back to empty
  
    var DeathCount = document.getElementById("DeathCount")
    
    for(var Incrementator = 0; Incrementator <= Pop_Sum; Incrementator++){
      setTimeout(() => DeathCount.innerText = Incrementator, 500)
    }
  
    
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
    $.getJSON(`./DensityRender/JSON_segm/Segm_${i}.json`, function(jsonInstance) {
      JSON_segments.push(jsonInstance["Arr"]);
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
