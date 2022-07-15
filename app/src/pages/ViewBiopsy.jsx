/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useContext, useState, Fragment } from "react";
import { useNavigate } from "@reach/router";

import { FirebaseContext } from "../firebaseContext/firebaseContext";
import Loader from "../components/Loader";
import BiopsyForm from "../components/BiopsyForm";
import Layout from "../components/Layout";
import utilities from "../materials/utilities";
import {
  generateOpenEncounterURL,
  generateEditBiopsyURL,
} from "../constants/routes";
import { generateBiopsyPath } from "../constants/datastore";
import BackLink from "../components/BackLink";

const ViewBiopsy = ({ encounterId, biopsyId }) => {
  const { datastore } = useContext(FirebaseContext);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const biopsyPath = generateBiopsyPath(encounterId, biopsyId);

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
          navigate(generateEditBiopsyURL(encounterId, biopsyId));
        } else {
          setInitialValues(values.data);
        }
      } else {
        navigate(generateOpenEncounterURL(encounterId));
      }
    };
    if (!!datastore) {
      getData(biopsyPath);
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
          <h1 css={utilities.form.title}>View Biopsy</h1>
          <p css={styles.exportedInfo} data-testid="exported-info">
            This biopsy has been exported and can no longer be edited in the
            app.
          </p>
          <BiopsyForm initialValues={initialValues} isViewOnly />
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

export default ViewBiopsy;
