/** @jsx jsx */
import { jsx } from "@emotion/core";

import utilities from "../materials/utilities";

import ListHeader from "./list/ListHeader";
import Button from "../components/Button";
import {generateNewBiopsiesURL} from "../constants/routes";
import { Link } from "@reach/router";


const BiopsyList = ({ items, encounterId, encounterExported = false }) => {
  return (
    <div css={utilities.list.container}>
      <ListHeader title="Biopsies">
        <Link to={generateNewBiopsiesURL(encounterId)}>
          {!encounterExported && <Button testId={"newBiopsy"} isSmall>+ New</Button>}
       </Link>
      </ListHeader>
    </div>
  );
};

export default BiopsyList;
