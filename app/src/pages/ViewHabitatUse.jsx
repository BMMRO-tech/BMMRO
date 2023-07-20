/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Layout from "../components/Layout";
import HabitatUseForm from "../components/HabitatUseForm";
import Loader from "../components/Loader";
import {
  generateOpenEncounterURL,
  generateEditHabitatURL,
} from "../constants/routes";
import { generateHabitatUsePath } from "../constants/datastore";
import utilities from "../materials/utilities";
import BackLink from "../components/BackLink";

const ViewHabitatUse = ({ encounterId, habitatUseId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const habitatUsePath = generateHabitatUsePath(encounterId, habitatUseId);

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
          navigate(generateEditHabitatURL(encounterId, habitatUseId));
        } else {
          setInitialValues(values.data);
        }
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
      getData(habitatUsePath);
    }
    // eslint-disable-next-line
  }, [datastore]);

  return (
    <Layout hasDefaultPadding={false}>
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
          <h1 css={utilities.form.title}>View Habitat Use</h1>
          <p css={styles.exportedInfo} data-testid="exported-info">
            This habitat use has been exported and can no longer be edited in
            the app.
          </p>
          <HabitatUseForm initialValues={initialValues} isViewOnly />
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

export default ViewHabitatUse;
