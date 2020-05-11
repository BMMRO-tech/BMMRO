/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

const RecordSummary = ({ date, time, encSeqNo }) => {
  const styles = {
    recordDetail: css`
      padding-right: 15px;
    `,
  };

  return (
    <tr>
      <td css={styles.recordDetail}>{date}</td>
      <td css={styles.recordDetail}>{time}</td>
      <td css={styles.recordDetail}>{encSeqNo}</td>
    </tr>
  );
};

const RecordSummaryList = ({ title, records }) => {
  const styles = {
    tableHeader: css`
      text-align: left;
    `,
  };

  return (
    <Fragment>
      <h2>{title}</h2>
      <table>
        <tr css={styles.tableHeader}>
          <th>Date</th>
          <th>Time</th>
          <th>Enc Seq #</th>
        </tr>
        {records.map((record, i) => (
          <RecordSummary
            key={`record-summary-${i}`}
            date={record.date}
            time={record.time}
            encSeqNo={record.encSeqNo}
          />
        ))}
      </table>
    </Fragment>
  );
};

export default RecordSummaryList;
