import React from 'react'
import { css } from "@emotion/core";
import ClockLoader from "react-spinners/ClockLoader";
import { CircleLoader, ClipLoader, DotLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function Spinner ({loading, type}) {
  if (type === 'simple') {
    return <DotLoader
    size={20}
    css={override}
    color={"#123abc"}
    loading={loading}></DotLoader>
  }
  return (
    <ClockLoader
      css={override}
      color={"#123abc"}
      loading={loading}
    />
  )
}