#Setting population for each pixel
#HelloWorld7894, 13. 6. 2021

#BAALD (Both Axis to Array linear detection)

from PIL import Image
import json

Output_JSON = {
    "Arr" : []
}

def Load_and_Write(Spec_JSON):
    ImgInstance = Image.open("./nukeTheMap/pop-density.jpg")
    PixelAccessObject = ImgInstance.load()
    Img_RGB = ImgInstance.convert("RGB")

    print(ImgInstance.size) #Whole size of image
    print(PixelAccessObject[0, 0]) #Checking first pixel

    for Y in range(500): #Image width 1892
        for X in range(500): #Image height 1060
            #print(X, Y)
            PixelRGB_Val = Img_RGB.getpixel((X, Y))

            """
            Density Scaling
            """

            if PixelRGB_Val == (198, 205, 224): 
                Output_JSON["Arr"].append([X, Y, 0]) #Sea, Ocean, etc.
                continue
            elif PixelRGB_Val == (254, 246, 235) or (PixelRGB_Val[0] >= 254 and PixelRGB_Val[1] >= 246 and PixelRGB_Val[2] >= 235): 
                Output_JSON["Arr"].append([X, Y, 0.03]) #Min density
                continue
            elif abs(PixelRGB_Val[0] - PixelRGB_Val[1]) < 20 and abs(PixelRGB_Val[0] - PixelRGB_Val[2]) < 20: 
                Output_JSON["Arr"].append([X, Y, 0.06]) #Min density
                continue
            elif 190 < PixelRGB_Val[0] < 210 and 190 < PixelRGB_Val[1] < 210 and 210 < PixelRGB_Val[2] < 230: #Seashores
                Output_JSON["Arr"].append([X, Y, 0.06])
            elif 55 < PixelRGB_Val[0] < 75 and 15 < PixelRGB_Val[1] < 35 and 26 < PixelRGB_Val[1] < 46: 
                Output_JSON["Arr"].append([X, Y, 210000]) #Max Density
                continue

            #Range: 254 > 55 (for red) (Range: 179)

            else:                               #Max R    Current R         Pop multiplier #46.31 ###Updated###
                Output_JSON["Arr"].append([X, Y, (255 - PixelRGB_Val[0]) * 4631.84])

            """
            Some kind of correlations (Maybe)
            """

            #print(len(Output_JSON["Arr"]))
            #               Currently the last element added
            #if Output_JSON["Arr"][len(Output_JSON["Arr"]) - 1] < Output_JSON["Arr"][len(Output_JSON["Arr"])] / 4: Output_JSON["Arr"][len(Output_JSON["Arr"] - 1)] = Output_JSON["Arr"][len(Output_JSON["Arr"])] / 4 #Doesn´t work



    #print(Output_JSON)
    Spec_JSON.write(json.dumps(Output_JSON, indent = 3))



#Setting the Access to json (And also rewriting it)
with open("./nukeTheMap/PixelAssign.json", "w") as JSON_file:
    Load_and_Write(JSON_file)
    #(65, 25, 36) - 210 000 #Max
    #(92, 20, 6) - 82 910 #Max med
    #(254, 246, 235) - 0.3 #Min med 
    #(198, 205, 224) - 0 #Min

    """
    ImgInstance = Image.open("./nukeTheMap/pop-density.jpg")
    PixelAccessObject = ImgInstance.load()
    Img_RGB = ImgInstance.convert("RGB")

    print(Img_RGB.getpixel((447, 74)))
    """
