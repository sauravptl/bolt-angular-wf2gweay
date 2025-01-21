import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAj1IjoAZ5jf1j_6Tl8LZO5UdBPpDtfq7k",
  authDomain: "gemican-ai.firebaseapp.com",
  projectId: "gemican-ai",
  storageBucket: "gemican-ai.firebasestorage.app",
  messagingSenderId: "483719526622",
  appId: "1:483719526622:web:b0ff14124cce2352242a4f",
  measurementId: "G-0EHEP9CCEF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth
export const googleOAuthConfig = {
  client_id: "1084581626830-c3i63eei0ehabm7rmi5adf5s35eikl4b.apps.googleusercontent.com",
  project_id: "unified-scout-447517-q6",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: "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",
  redirect_uris: ["https://heroic-otter-00aa51.netlify.app", "http://localhost:3000"],
  javascript_origins: ["https://heroic-otter-00aa51.netlify.app", "http://localhost:3000"]
};