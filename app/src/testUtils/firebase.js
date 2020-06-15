import firebase from "firebase";

export const buildFirebaseAuthMock = ({
  signInWithEmailAndPassword = "",
  signOut = "",
}) => {
  jest.spyOn(firebase, "auth").mockImplementation(() => {
    return {
      onAuthStateChanged: jest.fn(),
      signInWithEmailAndPassword,
      signOut,
    };
  });
};

export const buildFirestoreMock = () => {
  jest.spyOn(firebase, "firestore").mockImplementation(() => {
    return {
      enablePersistence: jest.fn(),
    };
  });
};
