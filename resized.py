import os
from PIL import Image, ImageOps

# Folder where you want to increase images
input_folder = "dataset_resized/train/Banni"   # <-- change breed name & path
output_folder = "dataset_resized/train/Banni2"
os.makedirs(output_folder, exist_ok=True)

# Augmentation functions
def augment_image(img, filename, save_dir):
    base_name = os.path.splitext(filename)[0]

    # Save original
    img.save(os.path.join(save_dir, f"{base_name}_orig.jpg"))

    # Flip horizontally
    img_flip = ImageOps.mirror(img)
    img_flip.save(os.path.join(save_dir, f"{base_name}_flip.jpg"))

    # Flip vertically
    img_vflip = ImageOps.flip(img)
    img_vflip.save(os.path.join(save_dir, f"{base_name}_vflip.jpg"))

    # Rotate 90 degrees
    img_90 = img.rotate(90, expand=True)
    img_90.save(os.path.join(save_dir, f"{base_name}_rot90.jpg"))

    # Rotate 180 degrees
    img_180 = img.rotate(180, expand=True)
    img_180.save(os.path.join(save_dir, f"{base_name}_rot180.jpg"))

    # Rotate 270 degrees
    img_270 = img.rotate(270, expand=True)
    img_270.save(os.path.join(save_dir, f"{base_name}_rot270.jpg"))

    print(f"✅ Augmented {filename}")


# Loop through all images
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        try:
            img_path = os.path.join(input_folder, filename)
            img = Image.open(img_path).convert("RGB")

            augment_image(img, filename, output_folder)

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

print("🎉 Augmentation complete! Check:", output_folder)
