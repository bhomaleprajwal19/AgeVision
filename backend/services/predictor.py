from pathlib import Path

import cv2
import numpy as np
import tensorflow as tf

from backend.services.face_detector import FaceDetector


class AgeGenderPredictor:

    def __init__(self):

        # Project root
        project_root = Path(__file__).resolve().parents[2]

        model_path = (
            project_root
            / "models"
            / "age_gender_modelv2.keras"
        )

        # Load model once
        self.model = tf.keras.models.load_model(
            model_path
        )

        print(
            "Age-Gender model loaded successfully"
        )

        # Face detector
        self.face_detector = FaceDetector()

        print(
            "Face detector loaded successfully"
        )

    def predict(self, image):

        faces = self.face_detector.detect_faces(
            image
        )

        predictions = []

        for i, (x, y, w, h) in enumerate(faces):

            # -----------------------------------------
            # Crop face
            # -----------------------------------------

            face = self.face_detector.crop_face(
                image,
                x,
                y,
                w,
                h
            )

            # -----------------------------------------
            # Convert BGR → RGB
            # -----------------------------------------

            face_rgb = cv2.cvtColor(
                face,
                cv2.COLOR_BGR2RGB
            )

            # -----------------------------------------
            # Resize
            # -----------------------------------------

            face_rgb = cv2.resize(
                face_rgb,
                (128, 128)
            )

            # -----------------------------------------
            # Normalize
            # -----------------------------------------

            face_rgb = face_rgb.astype(
                "float32"
            ) / 255.0

            # -----------------------------------------
            # Add batch dimension
            # -----------------------------------------

            face_rgb = np.expand_dims(
                face_rgb,
                axis=0
            )

            # -----------------------------------------
            # Model prediction
            # -----------------------------------------

            age_pred, gender_pred = (
                self.model.predict(
                    face_rgb,
                    verbose=0
                )
            )

            # -----------------------------------------
            # Age
            # -----------------------------------------

            age = float(
                age_pred[0][0]
            )

            # -----------------------------------------
            # Gender
            #
            # UTKFace:
            # 0 = Male
            # 1 = Female
            # -----------------------------------------

            gender_probability = float(
                gender_pred[0][0]
            )

            if gender_probability <= 0.5:

                gender = "Male"

                confidence = (
                    1 - gender_probability
                )

            else:

                gender = "Female"

                confidence = (
                    gender_probability
                )

            # -----------------------------------------
            # Add prediction
            # -----------------------------------------

            predictions.append({

                "face_id": i + 1,

                "age": round(
                    age,
                    2
                ),

                "gender": gender,

                "gender_confidence": round(
                    confidence,
                    4
                ),

                "bounding_box": {

                    "x": int(x),

                    "y": int(y),

                    "width": int(w),

                    "height": int(h)
                }
            })

        return predictions