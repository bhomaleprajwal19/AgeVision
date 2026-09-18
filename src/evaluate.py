import numpy as np
import tensorflow as tf
import cv2

# Load trained model
model = tf.keras.models.load_model(
    "models/age_gender_modelv2.keras"
)

# Image path
image_path = "test.jpg"

# Read image
img = cv2.imread(image_path)

# OpenCV loads BGR, convert to RGB
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Resize
img = cv2.resize(img, (128, 128))

# Normalize
img = img / 255.0

# Add batch dimension
img = np.expand_dims(img, axis=0)

# Prediction
age_pred, gender_pred = model.predict(img)

# Extract values
age = age_pred[0][0]
gender_probability = gender_pred[0][0]

# Convert probability to gender
if gender_probability >= 0.5:
    gender = "female"
else:
    gender = "male"

print("Predicted Age:", round(age, 2))
print("Predicted Gender:", gender)
print("Gender Probability:", round(float(gender_probability), 4))