#Setting population for each pixel
#HelloWorld7894, 13. 6. 2021

#BAALD (Both Axis to Array linear detection)

from PIL import Image
import json
import numpy as np

Output_JSON = {
    "Arr" : []
}

def Load_and_Write(Spec_JSON):
    ImgInstance = Image.open("./nukeTheMap/pop-density.jpg")
    Img_RGB = ImgInstance.convert("RGB")
    PixelAccessObject = Img_RGB.load()

    print(Img_RGB.size) #Whole size of image
    print(PixelAccessObject[0, 0]) #Checking first pixel


    for Y in range(Img_RGB.size[1]): #Image height 1920
        for X in range(Img_RGB.size[0]): #Image width 1080
            #print(X, Y)
            R, G, B = PixelAccessObject[X, Y][0], PixelAccessObject[X, Y][1], PixelAccessObject[X, Y][2]

            """
            Density Scaling
            """

            if (R, G, B) == (198, 205, 224): 
                Output_JSON["Arr"].append([X, Y, 0]) #Sea, Ocean, etc.
                continue
            elif (R, G, B) == (254, 246, 235) or (R >= 254 and R >= 246 and R >= 235): 
                Output_JSON["Arr"].append([X, Y, 0.03]) #Min density
                continue
            elif abs(R - G) < 20 and abs(R - B) < 20: 
                Output_JSON["Arr"].append([X, Y, 0.06]) #Min density
                continue
            elif 190 < R < 210 and 190 < G < 210 and 210 < B < 230: #Seashores
                Output_JSON["Arr"].append([X, Y, 0.06])
            elif 55 < R < 75 and 15 < G < 35 and 26 < B < 46: 
                Output_JSON["Arr"].append([X, Y, 210000]) #Max Density
                continue

            #Range: 254 > 55 (for red) (Range: 179)

            else:                               #Max R, Current R, Pop multiplier #46.31 ###Updated###
                Output_JSON["Arr"].append([X, Y, (255 - R) * 4631.84])

            """
            Some kind of correlations (Maybe)
            """

            #print(len(Output_JSON["Arr"]))
            #               Currently the last element added
            #if Output_JSON["Arr"][len(Output_JSON["Arr"]) - 2][2] < Output_JSON["Arr"][len(Output_JSON["Arr"]) - 1][2] / 4: Output_JSON["Arr"][len(Output_JSON["Arr"] - 2)][2] = Output_JSON["Arr"][len(Output_JSON["Arr"] - 1)][2] / 4 #Doesn´t work



    #print(Output_JSON)
    Spec_JSON.write(json.dumps(Output_JSON, indent = 3))



#Setting the Access to json (And also rewriting it)
with open("./nukeTheMap/PixelAssign.json", "w") as JSON_file:
    Load_and_Write(JSON_file)
    #(65, 25, 36) - 210 000 #Max
    #(92, 20, 6) - 82 910 #Max med
    #(254, 246, 235) - 0.3 #Min med 
    #(198, 205, 224) - 0 #Min

