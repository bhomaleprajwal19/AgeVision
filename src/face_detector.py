import cv2
import numpy as np
import tensorflow as tf


# ============================================================
# 1. LOAD MODEL
# ============================================================

model = tf.keras.models.load_model(
    "models/age_gender_modelv2.keras"
)

print("Model loaded successfully")


# ============================================================
# 2. LOAD FACE DETECTOR
# ============================================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)

if face_cascade.empty():
    print("Error: Could not load Haar Cascade")
    exit()


# ============================================================
# 3. READ IMAGE
# ============================================================

image_path = "test.jpg"
image = cv2.imread(image_path)

if image is None:
    print("Error: Could not read image")
    exit()


# Keep original image for displaying
output_image = image.copy()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


# ============================================================
# 4. DETECT FACES
# ============================================================

faces = face_cascade.detectMultiScale(
    gray,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(60, 60)
)

print("Faces detected:", len(faces))


# ============================================================
# 5. PROCESS EACH FACE
# ============================================================

for i, (x, y, w, h) in enumerate(faces):

    print("\nProcessing Face", i + 1)

    # --------------------------------------------------------
    # Expand bounding box
    # --------------------------------------------------------

    padding = 0.30

    x1 = int(x - w * padding)
    y1 = int(y - h * padding)

    x2 = int(x + w * (1 + padding))
    y2 = int(y + h * (1 + padding))

    # --------------------------------------------------------
    # Keep coordinates inside image
    # --------------------------------------------------------

    x1 = max(0, x1)
    y1 = max(0, y1)

    x2 = min(image.shape[1], x2)
    y2 = min(image.shape[0], y2)

    # --------------------------------------------------------
    # Make crop square
    # --------------------------------------------------------

    crop_width = x2 - x1
    crop_height = y2 - y1

    size = max(crop_width, crop_height)

    center_x = (x1 + x2) // 2
    center_y = (y1 + y2) // 2

    x1 = center_x - size // 2
    y1 = center_y - size // 2

    x2 = x1 + size
    y2 = y1 + size

    # Keep square inside image
    if x1 < 0:
        x2 -= x1
        x1 = 0

    if y1 < 0:
        y2 -= y1
        y1 = 0

    if x2 > image.shape[1]:
        x1 -= (x2 - image.shape[1])
        x2 = image.shape[1]

    if y2 > image.shape[0]:
        y1 -= (y2 - image.shape[0])
        y2 = image.shape[0]

    x1 = max(0, x1)
    y1 = max(0, y1)

    # --------------------------------------------------------
    # Crop expanded face
    # --------------------------------------------------------

    face = image[y1:y2, x1:x2]

    # --------------------------------------------------------
    # Save crop
    # --------------------------------------------------------

    filename = f"detected_face_{i}.jpg"

    cv2.imwrite(filename, face)

    print("Saved:", filename)


    # ========================================================
    # 6. PREPROCESS FOR CNN
    # ========================================================

    face_rgb = cv2.cvtColor(
        face,
        cv2.COLOR_BGR2RGB
    )

    face_rgb = cv2.resize(
        face_rgb,
        (128, 128)
    )

    face_rgb = face_rgb.astype(
        "float32"
    ) / 255.0

    face_rgb = np.expand_dims(
        face_rgb,
        axis=0
    )


    # ========================================================
    # 7. PREDICT
    # ========================================================

    age_pred, gender_pred = model.predict(
        face_rgb,
        verbose=0
    )

    age = float(age_pred[0][0])

    gender_probability = float(
        gender_pred[0][0]
    )


    # ========================================================
    # 8. GENDER
    # ========================================================

    # UTKFace:
    # 0 = Male
    # 1 = Female

    if gender_probability <= 0.5:

        gender = "Male"

        confidence = 1 - gender_probability

    else:

        gender = "Female"

        confidence = gender_probability


    # ========================================================
    # 9. PRINT RESULT
    # ========================================================

    print("Age:", round(age, 2))
    print("Gender:", gender)
    print("Gender score:", round(gender_probability, 4))


    # ========================================================
    # 10. DRAW ORIGINAL DETECTION BOX
    # ========================================================

    cv2.rectangle(
        output_image,
        (x, y),
        (x + w, y + h),
        (0, 255, 0),
        2
    )


    # ========================================================
    # 11. DISPLAY RESULT
    # ========================================================

    label = f"{gender}, Age: {age:.0f}"

    cv2.putText(
        output_image,
        label,
        (x, max(y - 10, 20)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )


# ============================================================
# 12. DISPLAY RESULT
# ============================================================

cv2.imshow(
    "Age & Gender Detection",
    output_image
)

cv2.waitKey(0)

cv2.destroyAllWindows()