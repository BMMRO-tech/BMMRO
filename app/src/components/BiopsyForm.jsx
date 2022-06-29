/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Button from "../components/Button";
import { Link } from "@reach/router";
import { generateOpenEncounterURL } from "../constants/routes";

import utilities from "../materials/utilities";

const styles = {
    cancelButton: css`
      margin-right: 10px;
    `,
    section: css`
      background-color: none;
    `,
};

const BiopsyForm = ({ encounterId }) => {
    return (
            <div css={utilities.sticky.contentContainer}>
                <div css={utilities.form.container}>
                    <div css={utilities.sticky.footerContainer}>
                        <Link to={generateOpenEncounterURL(encounterId)}>
                            <Button
                                styles={styles.cancelButton}
                                variant="secondary"
                                testId={"cancelBiopsy"}>
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
    );
}

export default BiopsyForm;