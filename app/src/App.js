/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Router } from "@reach/router";

import Landing from "./pages/Landing";
import HabitatUse from "./pages/HabitatUse";
import Login from "./pages/Login";

import { FirebaseContextProvider } from "./firebaseContext/firebaseContext";

const App = () => {
  return (
    <FirebaseContextProvider>
      <Router>
        <Landing path="/" />
        <Login path="/login" />
        <HabitatUse path="/habitat" />
      </Router>
    </FirebaseContextProvider>
  );
};

export default App;
