import admin, { ServiceAccount } from "firebase-admin";

const serviceaccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_TYPE,
  privateKey: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_CLIENT_EMAIL,
};

if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: process.env.NEXT_PUBLIC_APP_FIRBASE_DTABASE_URL,
});
}


export default admin;
