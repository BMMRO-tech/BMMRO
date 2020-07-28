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
    <li css={styles.container} data-testid="habitat-use-list-item">
      <span css={styles.time}>{content.data.startTime}</span>
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
    b.data.startTime.localeCompare(a.data.startTime)
  );

  return (
    <ul css={styles}>
      {sortedItems.map((item) => (
        <HabitatUseListItem
          key={`habitatUseListItem-${item.path}`}
          content={item}
        />
      ))}
    </ul>
  );
};

export default HabitatUseList;
