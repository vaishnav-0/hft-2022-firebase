const admin = require("firebase-admin");

const serviceAccount = require("./beclean-c25cc-firebase-adminsdk-ik6t5-6387b8b3a3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

 const auth = admin.auth();

 function setAdminRole(uid){
    auth.setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log("successful");
    });
 }
 
 setAdminRole("ElBT6SNBEJcavOh3vuhxQD15w5W2");