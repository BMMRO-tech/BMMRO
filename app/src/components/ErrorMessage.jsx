/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";

const ErrorMessage = ({ text }) => {
    const styles = {
        error: css`
          margin-top: 15px;
          color: ${colors.red};
        `,
    };

    return (
        <div css={styles.error}>{text}</div>
    )
}

export default ErrorMessage;