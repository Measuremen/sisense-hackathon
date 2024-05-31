/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { useExecuteQuery } from "@sisense/sdk-ui";
import * as FileSaver from 'file-saver';

export const Download: FC<any> = ({
    dimensions,
    DataSource,
    type
}) => {
  const [enable, setEnable] = useState(false);

  const onExport = () => {
    setEnable(true);
  }
  
  const queryProps = {
    dataSource: DataSource,
    dimensions: dimensions[type],
    enabled: enable
  };
  const { data, isLoading, isError } = useExecuteQuery(queryProps);

  

  useEffect(() => {
    if (!isLoading && data) {
      console.log({data}, isError);
      const columns = data?.columns.map((col: any) => col.name);
  
      // Extract rows
      const rows = data?.rows.map((row: any) => row.map((cell: any) => cell.data));
      
      // Convert data to CSV format
      const csvContent = `${columns?.join(',')}\n${rows?.map(row => row.join(',')).join('\n')}`;
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
      // Save the Blob object as a CSV file
      FileSaver.saveAs(blob, `${type}.csv`);
    }
  }, [enable, data])


  return (
    <>
     <button style={{padding: "10px 0", margin: "5px 0"}} onClick={onExport}>Download {type} Data</button>
    </>
  );
};

export default Download;
