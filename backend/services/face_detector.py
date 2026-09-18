import cv2
import numpy as np


class FaceDetector:

    def __init__(self):

        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades
            + "haarcascade_frontalface_default.xml"
        )

        if self.face_cascade.empty():
            raise RuntimeError(
                "Could not load Haar Cascade"
            )

    def detect_faces(self, image):

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(60, 60)
        )

        return faces

    def crop_face(
        self,
        image,
        x,
        y,
        w,
        h
    ):

        # Expand bounding box
        padding = 0.30

        x1 = int(x - w * padding)
        y1 = int(y - h * padding)

        x2 = int(x + w * (1 + padding))
        y2 = int(y + h * (1 + padding))

        # Keep coordinates inside image
        x1 = max(0, x1)
        y1 = max(0, y1)

        x2 = min(
            image.shape[1],
            x2
        )

        y2 = min(
            image.shape[0],
            y2
        )

        # Make crop square
        crop_width = x2 - x1
        crop_height = y2 - y1

        size = max(
            crop_width,
            crop_height
        )

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
            x1 -= x2 - image.shape[1]
            x2 = image.shape[1]

        if y2 > image.shape[0]:
            y1 -= y2 - image.shape[0]
            y2 = image.shape[0]

        x1 = max(0, x1)
        y1 = max(0, y1)

        # Final face crop
        face = image[
            y1:y2,
            x1:x2
        ]

        return face