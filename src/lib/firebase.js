import admin from "firebase-admin";

// Kiểm tra nếu app chưa được khởi tạo thì mới initialize
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Khởi tạo bucket (chỉ gọi sau khi app đã tồn tại)
const bucket = admin.storage().bucket();

/**
 * Upload file lên Firebase Storage
 * @param {File} file - File từ request (FormData)
 * @returns {Promise<string>} URL công khai của file
 */
export const uploadFileToFirebase = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const fileData = Buffer.from(arrayBuffer);
  const extension = file.name?.split(".").pop();
  const fileName = `${Date.now()}.${extension}`;
  const uploadTo = fileName;

  const remoteFile = bucket.file(uploadTo);
  await remoteFile.save(fileData, {
    metadata: { contentType: file.type },
  });

  // Cho phép truy cập công khai
  await remoteFile.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${uploadTo}`;
};

export { bucket };
