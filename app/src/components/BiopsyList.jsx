/** @jsx jsx */
import { jsx } from "@emotion/core";


import utilities from "../materials/utilities";

import ListHeader from "./list/ListHeader";
import Button from "../components/Button";



const BiopsyList = ({ items, encounterId, encounterExported = false }) => {
 
  
    return (
      <div css={utilities.list.container}>
        <ListHeader title="Biopsies">
          {!encounterExported && (
              <Button isSmall>+ New</Button>
          )}
        </ListHeader>
        </div>
        )}

export default BiopsyList;