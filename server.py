from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import tensorflow as tf
import uuid
import json

# -----------------------------
# Flask setup
# -----------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -----------------------------
# Load trained model
# -----------------------------
MODEL_PATH = "cattle_breed_model.keras"
CLASSES_PATH = "saved_model/breed_classifier/classes.json"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Error loading model:", e)
    model = None

# Load class labels from the training metadata
try:
    with open(CLASSES_PATH, "r") as f:
        CLASS_NAMES = json.load(f)
except Exception as e:
    print("❌ Error loading classes:", e)
    CLASS_NAMES = []

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Secure filename using UUID to avoid conflicts
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        # Preprocess image: the model expects raw [0,255] pixels
        # (preprocessing is handled inside the model via mobilenet_v2.preprocess_input)
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)
        confidence = float(np.max(predictions)) * 100.0
        class_index = int(np.argmax(predictions))
        breed_name = CLASS_NAMES[class_index] if CLASS_NAMES else str(class_index)

        # Build response (frontend reads "breed" and "confidence" as a percentage)
        result = {
            "breed": breed_name,
            "breed_name": breed_name,
            "confidence": round(confidence, 1),
            "type": "cattle" if "buffalo" not in breed_name.lower() else "buffalo",
            "characteristics": [
                "High milk yield",
                "Disease resistant",
                "Adaptable to local climate"
            ]
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

    finally:
        # Clean up uploaded file after prediction
        if os.path.exists(file_path):
            os.remove(file_path)

# -----------------------------
# Run Flask backend
# -----------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
