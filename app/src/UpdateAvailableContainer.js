/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as serviceWorker from "./serviceWorker";
import { Fragment, useState, useEffect } from "react";
import Button from "./components/Button";

const UpdateAvailableContainer = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorker.register({
      onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
          setIsUpdateAvailable(true);
          waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        }
      },
    });
  }, []);

  return (
    <Fragment>
      {isUpdateAvailable && (
        <Button onClick={() => window.location.reload(false)}>
          Click to update the app.
        </Button>
      )}

      {children}
    </Fragment>
  );
};

export default UpdateAvailableContainer;
