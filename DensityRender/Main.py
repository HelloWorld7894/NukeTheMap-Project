#Setting population for each pixel
#HelloWorld7894, 13. 6. 2021

from PIL import Image
import json

Color_Metrics = {

}

Output_JSON = {
    "Arr" : []
}

def Load_and_Write(Spec_JSON):
    ImgInstance = Image.open("./nukeTheWorld/pop-density.jpg")
    PixelAccessObject = ImgInstance.load()
    Img_RGB = ImgInstance.convert("RGB")

    print(ImgInstance.size) #Whole size of image
    print(PixelAccessObject[0, 0]) #Checking first pixel

    for Y in range(1892): #Image width 1892
        for X in range(1060): #Image height 1060
            print(X, Y)
            PixelRGB_Val = Img_RGB.getpixel((X, Y))

            if PixelRGB_Val == (198, 205, 224): 
                Output_JSON["Arr"].append([X, Y, 0]) #Sea, Ocean, etc.
                continue
            if PixelRGB_Val == (254, 246, 235) or (PixelRGB_Val[0] >= 254 and PixelRGB_Val[1] >= 246 and PixelRGB_Val[2] >= 235):  
                Output_JSON["Arr"].append([X, Y, 0.03]) #Min density
                continue
            if 55 < PixelRGB_Val[0] < 75 and 15 < PixelRGB_Val[1] < 35 and 26 < PixelRGB_Val[1] < 46: 
                Output_JSON["Arr"].append([X, Y, 21000]) #Max Density
                continue

            #Range: 254 > 55 (for red) (Range: 179)

            else:                               #Max R    Current R         Pop multiplier #46.31 ###Updated###
                Output_JSON["Arr"].append([X, Y, (255 - PixelRGB_Val[0]) * 46318.4])

    #print(Output_JSON)
    Spec_JSON.write(json.dumps(Output_JSON, indent = 3))



#Setting the Access to json (And also rewriting it)
with open("./nukeTheWorld/PixelAssign.json", "w") as JSON_file:
    Load_and_Write(JSON_file)
    #(65, 25, 36) - 210 000 #Max
    #(92, 20, 6) - 82 910 #Max med
    #(254, 246, 235) - 0.3 #Min med 
    #(198, 205, 224) - 0 #Min
