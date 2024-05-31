/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, styled } from "@mui/material";
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
    <StyledButton color='warning' variant="contained" onClick={() => generatePDF(getTargetElement, options)}>Generate PDF</StyledButton>
  );
};

const StyledButton = styled(Button)({
  marginLeft: "1rem"
})
export default ExportPDF;
