import os
import cv2
import numpy as np

DATASET_PATH = "datasetS/UTKFace"
IMG_SIZE = 128

def load_dataset():
    images = []
    ages= []
    genders = []

    for filename in os.listdir(DATASET_PATH):
        if not filename.lower().endswith(".jpg"):
            continue

        try:
            parts=filename.split("_")
            age=int(parts[0])
            gender=int(parts[1])

            image_path=os.path.join(DATASET_PATH,filename)

            image=cv2.imread(image_path)
            image=cv2.resize(image,(IMG_SIZE,IMG_SIZE))
            image=cv2.cvtColor(image,cv2.COLOR_BGR2RGB)

            images.append(image)
            ages.append(age)
            genders.append(gender)
        except(ValueError,IndexError):
            continue

    X=np.array(images,dtype=np.float32)/255.0
    age = np.array(ages, dtype=np.float32)
    gender = np.array(genders, dtype=np.float32)       

    return X,age,gender

if __name__ =="__main__":
    X,age,gender=load_dataset()
    print("Images",X.shape)
    print("age lables",age.shape)
    print("gender lables",gender.shape)
            
   