"use client"; 

import { useState, useEffect } from "react";
import Image from "next/image";
import IconifyIcon from "./wrappers/IconifyIcon";
import defaultLogo from "@/assets/images/Person.png"; 
import Link from "next/link";
import axios from 'axios';


const LogoBox = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/get-logo")
      .then((res) => {
        if (res.data.imageUrl) {
          setSelectedImage(`${res.data.imageUrl}?t=${Date.now()}`); 
        }
      })
      .catch((err) => console.error("Error fetching logo:", err));
  }, []);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append("logo", file);
  
      try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setSelectedImage(`${response.data.imageUrl}?t=${Date.now()}`); 
        e.target.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <Link href="/dashboards/analytics">
        <Image
          src={selectedImage || defaultLogo} 
          width={120}
          height={80}
          style={{ opacity: "0.7", borderRadius: "50%" }}
          alt="logo"
        />
      </Link>

      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <IconifyIcon icon="ri-image-edit-line" style={{ fontSize: "20px", opacity: "0.8" }} />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};


export default LogoBox;
