/** @jsx jsx */
import { jsx } from "@emotion/core";
import Button from "../components/Button";
import { Link } from "@reach/router";
import { generateOpenEncounterURL } from "../constants/routes";


const BiopsyForm = ({ encounterId }) => {
    return (
        <div>
            
                <Link to={generateOpenEncounterURL(encounterId)}>
                    <Button testId={"cancelBiopsy"}> Cancel </Button>
                </Link>
        </div>
    );
}

export default BiopsyForm;