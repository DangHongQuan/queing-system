// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, getFirestore, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyD2_n2jaMMBF1qwAcFroeddE0ibt6p9Igs",
  authDomain: "project-1-804ed.firebaseapp.com",
  projectId: "project-1-804ed",
  storageBucket: "project-1-804ed.appspot.com",
  messagingSenderId: "1073530932270",
  appId: "1:1073530932270:web:8c81652e6d0e148cb8a3bf",
  measurementId: "G-RYEM5Y32S9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  address: string,
  phone: string,
  role: string,
  status: string,
  image: File
) => {

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Upload image to Storage
    const storageRef = ref(storage, `images/${userId}`);
    await uploadBytes(storageRef, image);

    // Save user information to Firestore
    const usersCollection = collection(firestore, "users");
    await addDoc(usersCollection, {
      name,
      email,
      password,
      address,
      phone,
      role,
      status,
      image: userId,
    });

    window.location.href=("/accounts")
 
};

export const loginUser = async (email: string, password: string) => {
 
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      // Lấy thông tin người dùng từ Firestore dựa trên email
      const querySnapshot = await getDocs(
        query(collection(firestore, "users"), where("email", "==", email))
      );
      const userDocs = querySnapshot.docs;

      if (userDocs.length > 0) {
        const userData = userDocs[0].data();
        const imageFileName = userData.image;

        // Lấy URL của ảnh từ Storage
        const storageRef = ref(storage, "images/" + imageFileName);
        const imageURL = await getDownloadURL(storageRef);



        // Trả về đối tượng chứa thông tin người dùng và URL của ảnh
        const userWithImageURL = {
          ...userData,
          imageURL: imageURL,
        };

        // Trả về đối tượng userWithImageURL
        return userWithImageURL;
      }}
  return null;
};


