import cv2
import numpy as np

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from backend.schemas.prediction import (
    PredictionResponse
)

from backend.services.predictor import (
    AgeGenderPredictor
)


router = APIRouter()


# Load predictor once
predictor = AgeGenderPredictor()


@router.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict(
    file: UploadFile = File(...)
):

    # -----------------------------------------
    # Validate file type
    # -----------------------------------------

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined"
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file"
        )

    # -----------------------------------------
    # Read image
    # -----------------------------------------

    image_bytes = await file.read()

    image_array = np.frombuffer(
        image_bytes,
        np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:

        raise HTTPException(
            status_code=400,
            detail="Could not read uploaded image"
        )

    # -----------------------------------------
    # Prediction
    # -----------------------------------------

    predictions = predictor.predict(
        image
    )

    # -----------------------------------------
    # Response
    # -----------------------------------------

    return {

        "success": True,

        "faces_detected": len(
            predictions
        ),

        "predictions": predictions
    }