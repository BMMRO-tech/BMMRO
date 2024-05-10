/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import typography from "../materials/typography";
import colors from "../materials/colors";
import ListHeader from "./list/ListHeader";
import { DATE_FORMAT } from "../constants/forms";
import { format } from "date-fns";
import { Link } from "@reach/router";
import { RightArrow } from "./icons/RightArrow";

const TripOverview = ({ trip }) => {
  const styles = {
    container: css`
      background-color: ${colors.white};
      padding: 15px 10px;
      flex-wrap: wrap;
    `,
    summaryContainer: css`
      margin-bottom: 15px;
      display: flex;
      flex-wrap: wrap;
    `,

    item: css`
      padding: 20px 30px;
    `,

    title: css`
      ${typography.smallTitle}
    `,
    value: css`
      ${typography.largeText}
      color: ${colors.darkTurquoise};
    `,
    link: css`
      ${typography.largeText}
      font-weight: 600;
      color: ${colors.darkTurquoise};
      display: flex;
    `,
    arrow: css`
      margin-left: 5px;
      display: flex;
      align-items: center;

      svg {
        height: 15px;
        fill: ${colors.darkTurquoise};
        stroke: ${colors.darkTurquoise};
        stroke-width: 2;
      }
    `,
  };

  const renderItem = ({ title, value }) => {
    return (
      <div css={styles.item}>
        <div css={styles.title}>{title}</div>
        <div css={styles.value}>{value}</div>
      </div>
    );
  };

  return (
    <Fragment>
      <section data-testid="trip-info">
        <ListHeader title="Trip Details" />
        <div css={styles.container}>
          <div css={styles.summaryContainer}>
            {renderItem({ title: "Trip ID", value: trip.tripId })}
            {renderItem({
              title: "Date",
              value: format(trip.date, DATE_FORMAT),
            })}
            {renderItem({ title: "Time", value: trip.time })}
            {renderItem({ title: "Area", value: trip.area })}
            {renderItem({ title: "Vessel", value: trip.vessel })}
            {renderItem({ title: "Project", value: trip.project })}
            {renderItem({ title: "Observers", value: trip.observers })}
            {renderItem({
              title: "Number of observers",
              value: trip.numberOfObservers,
            })}
            {renderItem({ title: "Engine hours", value: trip.engineHours })}
            {renderItem({ title: "Wind speed", value: trip.windSpeed })}
            {renderItem({ title: "Wind direction", value: trip.windDirection })}
          </div>

          <Link css={styles.link} to={""}>
            <span id="editTripInformation">Edit Trip Information</span>
            <span css={styles.arrow}>
              <RightArrow />
            </span>
          </Link>
        </div>
      </section>
    </Fragment>
  );
};

export default TripOverview;
