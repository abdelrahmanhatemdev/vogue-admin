import admin, { ServiceAccount } from "firebase-admin";

const serviceaccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.NEXT_PUBLIC_APP_FIRBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: process.env.NEXT_PUBLIC_APP_FIRBASE_DTABASE_URL,
});
}

const auth = admin.auth()

export {auth as AdminAuth};
