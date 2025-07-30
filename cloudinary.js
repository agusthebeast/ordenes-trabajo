async function subirImagenCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/dlrbwgtfa/image/upload";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ordenes");

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
}
