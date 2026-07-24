import firebase from "firebase/compat/app";

export const buildFirebaseAuthMock = ({
  signInWithEmailAndPassword = "",
  signOut = "",
}) => {
  vi.spyOn(firebase, "auth").mockImplementation(() => {
    return {
      onAuthStateChanged: vi.fn(),
      signInWithEmailAndPassword,
      signOut,
    };
  });
};

export const buildFirestoreMock = () => {
  vi.spyOn(firebase, "firestore").mockImplementation(() => {
    return {
      enablePersistence: vi.fn(),
    };
  });
};
