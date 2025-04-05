import { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="text-center">
      <input type="file" onChange={handleUpload} className="mb-4" />
      {image && <img src={image} alt="Uploaded" className="max-h-[400px] mx-auto" />}
    </div>
  );
};

export default ImageUpload;
