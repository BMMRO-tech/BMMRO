/** @jsx jsx */
import { jsx } from "@emotion/core";
import { navigate } from "@reach/router";
import { createContext, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { ROUTES } from "../constants/routes";
import { initFirestore, Datastore } from "../datastore/datastore";
import clientPersistence from "../clientPersistence/clientPersistence";

const FirebaseContext = createContext();

const FirebaseContextProvider = ({ children }) => {
  const [datastore, setDatastore] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [datastoreError, setDatastoreError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const firestore = new Datastore(initFirestore(firebase));
        await firestore.enableOfflineStorage();
        setDatastore(firestore);
      } catch (e) {
        setDatastoreError(e.message);
      }
    })();
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setLoggedInUser(user);
      if (user) {
        clientPersistence.set("isLoggedIn", true);
      } else {
        clientPersistence.remove("isLoggedIn");
        navigate(ROUTES.login, { state: { from: window.location.pathname } });
      }
    });
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ loggedInUser, datastore, datastoreError }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseContextProvider };
