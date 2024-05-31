/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import * as DM from './sample-health';
import Download from "./download";

enum TableType {
  Admissions = 'Admissions',
  Conditionstimeofstay = 'Conditionstimeofstay',
  DataSource = 'DataSource',
  ER = 'ER'
}

export const ExportButton: FC<any> = () => {
  const [dimensions, setDimensions] = useState<any>([]);
  
  useEffect(()=> {
    fetchExportDataList()
  }, [])

  const fetchExportDataList = () => {
    const tableName = Object.keys(DM) as [TableType];
    for (let index = 0; index < tableName.length; index++) {
      const temp: any[] = [];
      const element = tableName[index];
      if (element !== 'DataSource' && element !== 'ER') {
        const attributes = DM[element].toJSON().attributes;
        attributes.forEach((e: any) => {
          temp.push(DM[element][e.name])
        });
        setDimensions((oldDimensions: any) => ({...oldDimensions, [element]: temp}));        
      }
    }
  }

  return (
    <>
      {Object.keys(dimensions).map(res => {
        return <>
          <Download type={res} dimensions={dimensions} DataSource={DM.DataSource}></Download>
        </>
      })}
    </>
  );
};

export default ExportButton;
