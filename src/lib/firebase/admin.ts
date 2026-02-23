import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const saVar = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (saVar) {
    try {
      const serviceAccount = JSON.parse(saVar);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.warn('Failed to parse FIREBASE_ADMIN_SERVICE_ACCOUNT', e);
    }
  } else {
    console.warn('FIREBASE_ADMIN_SERVICE_ACCOUNT is not set. Admin features will be unavailable.');
  }
}

const getAdminDb = () => {
  if (admin.apps.length === 0) return null;
  return admin.firestore();
};

const getAdminAuth = () => {
  if (admin.apps.length === 0) return null;
  return admin.auth();
};

export { getAdminDb, getAdminAuth };
