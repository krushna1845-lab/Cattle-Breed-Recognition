import os

train_dir = "dataset/train"
for breed in os.listdir(train_dir):
    breed_path = os.path.join(train_dir, breed)
    if os.path.isdir(breed_path):
        count = len(os.listdir(breed_path))
        print(f"{breed}: {count} images")
