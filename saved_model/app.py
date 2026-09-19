from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)  # allow React frontend to connect

# Load model once when server starts
model = tf.keras.models.load_model("breed_classifier/best_model_finetuned.keras")

print("Model input shape:", model.input_shape)
print("Model output shape:", model.output_shape)

# Load class names from JSON
with open("breed_classifier/classes.json", "r") as f:
    class_names = json.load(f)

def preprocess_image(image):
    img = image.resize((224, 224))  # adjust if your model needs different size
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route("/predict", methods=["POST"])
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(file.stream).convert("RGB")
    input_data = preprocess_image(image)

    predictions = model.predict(input_data)

    # ✅ Debug prints with readable classes
    for i, prob in enumerate(predictions[0]):
        print(f"{class_names[i]}: {prob*100:.2f}%")

    print("Best breed:", class_names[np.argmax(predictions)])
    print("Confidence:", np.max(predictions) * 100)

    predicted_class = class_names[np.argmax(predictions)]
    confidence = float(np.max(predictions) * 100)

    return jsonify({
        "breed": predicted_class,
        "confidence": confidence
    })


if __name__ == "__main__":
    app.run(debug=True)
