/** @jsx jsx */
import { jsx } from "@emotion/core";
import Button from "../components/Button";
// import { Link } from "@reach/router";
// import { generateOpenEncounterURL } from "../constants/routes";

const NewBiopsyForm = () => {
  return (
    <p>
      <h1>Hello</h1>
      {/* <Link to={generateOpenEncounterURL()}> */}
      <Button testId={"cancelBiopsy"}> Cancel </Button>
      {/* </Link> */}
    </p>
  );
};

export default NewBiopsyForm;
