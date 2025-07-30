import Constants from "expo-constants";

const cloudName = Constants.expoConfig?.extra?.CLOUDINARY_CLOUD_NAME!;
const uploadPreset = Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_PRESET!;

export async function uploadImageToCloudinary(
  imageUrl: string
): Promise<string> {
  try {
    const imageRes = await fetch(imageUrl);
    const blob = await imageRes.blob();
    const file = new File([blob], "image.png", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      console.error("❌ Cloudinary upload failed:", await res.text());
      throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    console.log("✅ Cloudinary uploaded:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Upload error:", error);
    return "https://via.placeholder.com/300x200?text=Upload+Failed";
  }
}
