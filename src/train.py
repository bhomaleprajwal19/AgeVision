import numpy as np
import tensorflow as tf

from preprocessing import load_dataset
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers,Model
from tensorflow.keras.callbacks import ModelCheckpoint

#Load dataset

X,ages,Genders=load_dataset()

print("Dataset loaded",X.shape)


#train/validation split

X_train,X_val,age_train,age_val,gender_train,gender_val=train_test_split(X,ages,Genders,test_size=0.2,random_state=42)

print("Training images:", X_train.shape)
print("Validation images:", X_val.shape)


#cnn feature extraction

inputs=layers.Input(shape=(128,128,3))

x=layers.Conv2D(32,(3,3),activation="relu")(inputs)
x=layers.MaxPooling2D((2,2))(x)

x=layers.Conv2D(64,(3,3),activation="relu")(x)
x=layers.MaxPooling2D((2,2))(x)

x=layers.Conv2D(128,(3,3),activation="relu")(x)
x=layers.MaxPooling2D((2,2))(x)

x=layers.Flatten()(x)

x=layers.Dense(128,activation="relu")(x)
x=layers.Dropout(0.3)(x)

#two prediction outputs

age_output=layers.Dense(1,name="age")(x)

gender_output=layers.Dense(1,activation="sigmoid",name="gender")(x)

#create model

model=Model(inputs=inputs,
            outputs=[age_output,gender_output])

#compile

model.compile(
    optimizer="adam",
    loss={"age":"mse",
          "gender":"binary_crossentropy"
          },
    loss_weights={"age":0.1,
                  "gender":1.0
                  },      
    metrics={
        "age":["mae"],
        "gender":["accuracy"]
    }
)

model.summary()

#Train
checkpoint = ModelCheckpoint(
    "models/age_gender_modelv2.keras",
    monitor="val_gender_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

history=model.fit(X_train,
                  {"age":age_train,
                   "gender":gender_train},
                   validation_data=(X_val,
                       {
                       "age":age_val,
                       "gender":gender_val
                       }
                   ),
                   epochs=10,
                   batch_size=32,
                   callbacks=[checkpoint]
                   )

print("model saved successfully")

