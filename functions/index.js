const functions = require("firebase-functions");
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();

const express = require('express');
const cors = require('cors');
const firestore = admin.firestore();

const app = express();


exports.createUser = functions.auth.user().onCreate(async (user) => {
    const docData = {
        name: user.displayName,
        email: user.email,
        phoneNo: user.phoneNumber,
        photoURL: user.photoURL,
        uid: user.uid,
    };

    await firestore.collection("users").doc(user.uid).set(docData);

});


exports.incrementLike = functions.firestore
    .document('users/{user}/likes/{like}')
    .onCreate((snap, context) => {
        const val = snap.data();
        firestore.collection("events").doc(val.eventId).update({ like_count: admin.firestore.FieldValue.increment(1) });
    });

exports.decrementLike = functions.firestore
    .document('users/{user}/likes/{like}')
    .onDelete((snap, context) => {
        const val = snap.data();
        firestore.collection("events").doc(val.eventId).update({ like_count: admin.firestore.FieldValue.increment(-1) });
    });


// exports.onUpdateVerifyContribution = functions.firestore
//     .document('users/{user}/contributions/{event}')
//     .onWrite((change, context) => {
//         const document = change.after.exists ? change.after.data() : null;
//         if (document) {
//             if (document.verified == true) {
//                 firestore.collection("users").doc(context.params.user).update({ [context.params.doc == "starting" ? "started" : "ended"]: document.status == true ? true : false });

//             }
//         }


//     });


exports.updateVerified = functions.firestore
    .document('events/{event}/verification/{doc}')
    .onWrite((change, context) => {
        const document = change.after.exists ? change.after.data() : null;
        if (document)
            if (context.params.doc == "starting" || context.params.doc == "ending")
                firestore.collection("events").doc(context.params.event).update({ [context.params.doc == "starting" ? "started" : "ended"]: document.status == true ? true : false });

    });
exports.api = functions.https.onRequest(app);
