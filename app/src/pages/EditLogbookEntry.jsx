/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { ROUTES, generateViewTripURL } from "../constants/routes";
import { generateLogbookPath } from "../constants/datastore";
import { getModifiedProperties } from "../utils/math";
import utilities from "../materials/utilities";
import LogbookForm from "../components/LogbookForm";
import BackLink from "../components/BackLink";

const EditLogbookEntry = ({ tripId, logbookId }) => {
  const styles = {
    exportedInfo: css`
      font-style: italic;
      padding-left: 10px;
      margin-top: 0;
    `,
  };

  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const [isExported, setIsExported] = useState(false);

  const navigate = useNavigate();
  const logbookPath = generateLogbookPath(tripId, logbookId);

  const handleSubmit = (values) => {
    const modifiedProperties = getModifiedProperties(values, initialValues);

    datastore.updateDocByPath(logbookPath, modifiedProperties);
    navigate(generateViewTripURL(tripId));
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        setIsExported(values.data.exported);
        setInitialValues(values.data);
      } else {
        navigate(generateViewTripURL(tripId));
      }
    };
    if (!!datastore) {
      getData(logbookPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
      {!initialValues ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>Edit Logbook Entry</h1>
          {isExported && (
            <p css={styles.exportedInfo} data-testid="exported-info">
              This logbook has been exported and can no longer be edited in the
              app.
            </p>
          )}
          <LogbookForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            tripId={tripId}
            isViewOnly={isExported}
          />
          {isExported && (
            <div css={utilities.backLinkContainer.bottom}>
              <BackLink text="Return to trip overview" to={ROUTES.trips} />
            </div>
          )}
        </Fragment>
      )}
    </Layout>
  );
};

export default EditLogbookEntry;
