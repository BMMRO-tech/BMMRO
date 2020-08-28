/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import utilities from "../materials/utilities";
import { generateEncounterPath } from "../constants/datastore";
import {
  ROUTES,
  generateOpenEncounterURL,
  generateEditEncounterURL,
} from "../constants/routes";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import EncounterForm from "../components/EncounterForm";
import BackLink from "../components/BackLink";

const ViewEncounter = ({ encounterId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const encounterPath = generateEncounterPath(encounterId);

  const styles = {
    exportedInfo: css`
      font-style: italic;
      padding-left: 10px;
      margin-top: 0;
    `,
  };

  useEffect(() => {
    const getData = async (path) => {
      const values = await datastore.readDocByPath(path);

      if (!!values.data) {
        if (!values.data.exported) {
          navigate(generateEditEncounterURL(encounterId));
        } else {
          setInitialValues(values.data);
        }
      } else {
        navigate(ROUTES.newEncounter);
      }
    };
    if (!!datastore) {
      getData(encounterPath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false} hasStickyButton={false}>
      <div css={utilities.backLinkContainer.top}>
        <BackLink
          text="Return to encounter overview"
          to={generateOpenEncounterURL(encounterId)}
        />
      </div>
      {!initialValues ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 css={utilities.form.title}>View Encounter</h1>
          <p css={styles.exportedInfo}>
            This encounter has been exported and can no longer be edited in the
            app.
          </p>
          <EncounterForm initialValues={initialValues} isViewOnly />
          <div css={utilities.backLinkContainer.bottom}>
            <BackLink
              text="Return to encounter overview"
              to={generateOpenEncounterURL(encounterId)}
            />
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

export default ViewEncounter;
