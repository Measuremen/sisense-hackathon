/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import generatePDF, { Margin, Resolution } from "react-to-pdf";

export const ExportPDF: FC<any> = () => {

  const options = {
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
   },
   filename: `${new Date().toISOString()}-Dashboard.pdf`
  }

  const getTargetElement = () => document.getElementById('print-box');


  return (
    <>
        <button onClick={() => generatePDF(getTargetElement, options)}>Generate PDF</button>
    </>
  );
};

export default ExportPDF;
