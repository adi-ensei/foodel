import { ID } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import dummyData from "./data";

// Import environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    )
  );
}

export async function uploadImageToCloudinary(
  imageUrl: string
): Promise<string> {
  try {
    const imageRes = await fetch(imageUrl);
    const blob = await imageRes.blob();

    const formData = new FormData();
    formData.append("file", {
      uri: imageUrl,
      name: "image.jpg",
      type: "image/jpeg",
    } as any); // 👈 for React Native
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cloudinary upload failed", text);
      throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    console.log("✅ Cloudinary uploaded:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Upload error:", error);
    return "https://via.placeholder.com/300x200?text=Upload+Failed";
  }
}

async function seed(): Promise<void> {
  await clearAll(appwriteConfig.categoriesCollectionId);
  await clearAll(appwriteConfig.customizationsCollectionId);
  await clearAll(appwriteConfig.menuCollectionId);
  await clearAll(appwriteConfig.menuCustomizationsCollectionId);

  // 1. Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      ID.unique(),
      cat
    );
    categoryMap[cat.name] = doc.$id;
  }

  // 2. Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customizationsCollectionId,
      ID.unique(),
      cus
    );
    customizationMap[cus.name] = doc.$id;
  }

  // 3. Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const uploadedImage = await uploadImageToCloudinary(item.image_url);

    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      ID.unique(),
      {
        name: item.name,
        description: item.description,
        image_url: uploadedImage,
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: categoryMap[item.category_name],
      }
    );

    menuMap[item.name] = doc.$id;

    // 4. Link customizations
    for (const cusName of item.customizations) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCustomizationsCollectionId,
        ID.unique(),
        {
          menu: doc.$id,
          customizations: customizationMap[cusName],
        }
      );
    }
  }

  console.log("✅ Seeding complete using Cloudinary.");
}

export default seed;
