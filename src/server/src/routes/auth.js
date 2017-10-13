import express from 'express';
import firebase from '../firebase';
import admin from '../admin';

const router = express.Router();

router.post('/', (req, res) => {
  const { accessToken } = req.body;

  //Verify currentUser login
  admin
    .auth()
    .verifyIdToken(accessToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;

      //Retrieve currentUser login detail
      admin
        .auth()
        .getUser(uid)
        .then(function(userRecord) {
          var displayName = !userRecord.displayName
            ? null
            : userRecord.displayName;
          var redirectURL = !userRecord.displayName
            ? '/updateDO'
            : '/addAttendance';

          res.json({
            user: {
              uid: uid,
              phoneNumber: decodedToken.phone_number,
              displayName: displayName,
              token: accessToken
            }
          });

          return res.redirect(redirectURL);

          c;
          // See the UserRecord reference doc for the contents of userRecord.
          //console.log("Successfully fetched user data:", userRecord.toJSON());
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
    })
    .catch(function(error) {
      // Handle error
      console.log(error);
    });
});

export default router;
