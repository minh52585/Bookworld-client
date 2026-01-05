// src/utils/cloudinaryAxios.ts
import axios from "axios";

export const cloudinaryAxios = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
