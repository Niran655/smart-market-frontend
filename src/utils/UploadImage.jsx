import React, { useEffect, useState } from "react";

import EmptyImage from "../assets/Image/empty-image.png";
import { supabase } from "../supabaseClient";

export default function UploadImage({ value, onChange, setFilePath }) {
  const [preview, setPreview] = useState(value || EmptyImage);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (value) setPreview(value);
    else setPreview(EmptyImage);
  }, [value]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const fileName = `${Date.now()}_${file.name}`;
    const bucketPath = `users/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(bucketPath, file, { upsert: true });

    if (error) {
      alert("Upload error: " + error.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(bucketPath);

    setPreview(urlData.publicUrl);
    onChange(urlData.publicUrl);

    if (setFilePath) setFilePath(bucketPath);

    setLoading(false);
  };

  const handleRemove = () => {
    setPreview(EmptyImage);
    onChange(null);
    if (setFilePath) setFilePath(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadBox}>
        <div style={styles.previewContainer}>
          <img src={preview} alt="Preview" style={styles.previewImage} />
         
        </div>

        <input
          type="file"
          onChange={handleFile}
          style={styles.fileInput}
          accept="image/*"
        />

        {loading && <div style={styles.loadingOverlay}>Uploading...</div>}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", marginTop: "10px" },
  uploadBox: {
    width: "150px",
    height: "150px",
    border: "2px dashed #aaa",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    // backgroundColor: "#f9f9f9",
  },
  previewContainer: { width: "100%", height: "100%", position: "relative" },
  previewImage: { width: "100%", height: "100%", objectFit: "cover" },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0,
    cursor: "pointer",
  },
  loadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#555",
  },
  removeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "rgba(0,0,0,0.6)",
    border: "none",
    color: "white",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center",
  },
};
