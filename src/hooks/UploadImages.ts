import { BASE_URL } from "@/constants";
async function uploadReviewImages(files: File[]) {
  const formData = new FormData();

  // Append multiple files to 'images' key
  files.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(`${BASE_URL}/image/upload-multiple`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error uploading images: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Uploaded URLs:", data.imageUrls);
    return data.imageUrls; // Use these URLs in your review payload
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default uploadReviewImages
