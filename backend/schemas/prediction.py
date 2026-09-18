from pydantic import BaseModel


class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int


class FacePrediction(BaseModel):
    face_id: int
    age: float
    gender: str
    gender_confidence: float
    bounding_box: BoundingBox


class PredictionResponse(BaseModel):
    success: bool
    faces_detected: int
    predictions: list[FacePrediction]