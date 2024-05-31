/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { useExecuteQuery } from "@sisense/sdk-ui";
import { Parser } from '@json2csv/plainjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const Download: FC<any> = ({
    dimensions,
    DataSource,
    type
}) => {
  const [enable, setEnable] = useState(false);
console.log(dimensions, DataSource);

  const onExport = () => {
    setEnable(true);
  }
  
  const queryProps = {
    dataSource: DataSource,
    dimensions: dimensions[type],
    enabled: enable
  };
  const { data, isLoading, isError } = useExecuteQuery(queryProps);

  if (!isLoading) {
    console.log({data}, isError);
  }

  return (
    <>
     <button onClick={() => onExport()}>Download {type} Data</button>
    </>
  );
};

export default Download;
