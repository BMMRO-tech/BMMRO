/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import colors from "../materials/colors";
import typography from "../materials/typography";

const HabitatUseListItem = ({ content }) => {
  const styles = {
    container: css`
      ${typography.text}
      padding: 15px;
      border-bottom: 1px solid ${colors.lightGray};
    `,
    time: css`
      margin-right: 10px;
    `,
  };
  return (
    <li css={styles.container}>
      <span css={styles.time}>{content.startTime}</span>
      <span>Habitat Use</span>
    </li>
  );
};

const HabitatUseList = ({ items }) => {
  const styles = css`
    list-style-type: none;
    padding: 0;
    margin: 0;
  `;

  const sortedItems = items.sort((a, b) =>
    b.startTime.localeCompare(a.startTime)
  );

  return (
    <ul css={styles}>
      {sortedItems.map((item, index) => (
        <HabitatUseListItem
          key={`habitatUseListItem-${index}`}
          content={item}
        />
      ))}
    </ul>
  );
};

export default HabitatUseList;
