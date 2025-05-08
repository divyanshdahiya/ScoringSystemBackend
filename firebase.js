import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "sepaktakraw-kiyg-2025-bihar",
  private_key_id: "77f42a2842b0be78e9bdbf748222a299d362f181",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnmnnflOf2peVa\nK307VkygDiMDBZe/4j/aZKGoR2XAX6cCmZqrFwcSe1kWtRIqZfwqabGKBOoVoWQF\nRZoUyUITiXBDnmO8z1/CbBs/w/UR3I3xvVhgwxZg46dUZNQd7klGf/x7+rRmdort\n9PdHr7k5kQ0t19gxOGB9YArlywngfBB4JQ6gz8QwtB3XWXMRSh3myzjA3CPO2cs4\npniT7Atuh0/J+71Rs9bnIbXbWzZmvWF3XuYBqJTibUBNTeIfJdgVDxjf8YSbFYGi\nKgbPeboN6jo6BzLE7UHEBjGAG7oxwqt32D9uqhechdCHqxBq9vsY361oA0fYzRfZ\nFJlOQ/o3AgMBAAECggEAJRSwvQ4hSfkHJq1zfgLIXiryhRMiMUJZtTRJbcUqFmcz\nOIiKZyrnliezHKp/8+Bva2TJ8krHDXUQ/3eYMNwcId1o+JTc5SOOQKIRX0i3+jUt\nNFwbZwESfOoxFaNfKKYVESN01WswqXC1qRLm+LXAiaN1YnycKLub4XEzyAZlT4RX\nCWHExzpdU3sQkgKJyOy8iPkIrpRkngFxQu96SNnZyixn5W8gSSTi5tsQtMyYuLU8\nkM6OdtEta5hi03FI6PWoW2+uYQByIQxXn1P1sVDCMHeAuZfBJnXydwqjPxYbDAVW\nPc0YULfNtNGY94nLbzOi+vBkrOCwkdhpMoTKcqp2qQKBgQDo3NCi64jDlUhi7Ocv\nmA7a+FXrpVlVopNN5PHUTCEEct7tgpi7ieD/JpKzoPYrUamt49i/Spn34TQDQwH2\nvrRtdHbYOHliAVcdQ4Vvg1r88N8ZxdQ+KgO91nrk6llfXAKAL/YZ3UQSiVrNWXuf\nwu4o5GXXUBmB26haOprdlb4NnwKBgQC4QbQhQPVjN6Zhue9nDPUAQC+DlRZcLiDO\nsh/hCXl/zRZQ/yXRJJfGSU2g1Rbc9cYkxEc/avDFVaguD/QKVzU2qinarhNcy0uQ\njyIR/chAdawOSxH85AXl+H0pHpFQRAfdU/1Dk8eqnQKaJM4zinx7HdNm7YYmzb81\n2y0iX00caQKBgCDx3LKwEBFbtXoJekvJf5CLQdys8A6liaGjmnMmsiUm+1Mu/tzJ\njQOMOYUgaLOIQjFP4wJtU4s2WV18xXJbWLuDlqzQkJvFBMYnH2G/e8f9bBMBYh3J\nY+4fwhNQ9IQBSHlKT88o9tCIjkgvOMZJldhDOAVWV8V/hjn9wJtI7DKRAoGAKoM2\nXWnQdFj1sZyl6P/rU2h7zf9LDm+yMB6XDmQSPXODT6LfBddMkXp+R7qCsO6gDgGf\ncrlo3g76Y85Yfz5Jz9gJGiSJ4SIiyDLOKJqGZqD/1rhpaRDvb3Ua467i1kMsEVv8\nlmf1bJ8XZ5tQXEH6oKlsClaJWlCkanesfT7B2ukCgYEA2eEMksnxUaCLu///nHY8\nq8LwGd1ve7up2KeoPbdmBhTb6XY0opfDDqHZVrsT9ay/sErucAlzB/VfsIJ3npHM\nHZ0l+AL4NgsdV8E/L6WFCplQh6EaBO2z0wAgNXYqdIIG6cGknkVJzii28vcRmk4h\n5C6pODGDcN3aopnKiDg3SgI=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@sepaktakraw-kiyg-2025-bihar.iam.gserviceaccount.com",
  client_id: "109916506206041987292",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sepaktakraw-kiyg-2025-bihar.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;
