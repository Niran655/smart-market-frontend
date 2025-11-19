import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "../firebase";

export const uploadFile = async (file) => {
  const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);

  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
