/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";
import typography from "../materials/typography";

const HabitatUseListItem = ({ content }) => {
  const styles = {
    container: css`
      ${typography.text}
      padding: 15px;
      border-bottom: 1px solid ${colors.mediumGray};
    `,
    time: css`
      margin-right: 10px;
    `,
  };
  return (
    <div css={styles.container}>
      <span css={styles.time}>{content.startTime}</span>
      <span>Habitat Use</span>
    </div>
  );
};

const HabitatUseList = ({ items }) =>
  items.map((item, index) => (
    <HabitatUseListItem key={`habitatUseListItem-${index}`} content={item} />
  ));

export default HabitatUseList;
