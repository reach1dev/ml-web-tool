import React from 'react'
import { css } from "@emotion/core";
import ClockLoader from "react-spinners/ClockLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function Spinner ({loading}) {
  return (
    <ClockLoader
      css={override}
      color={"#123abc"}
      loading={loading}
    />
  )
}