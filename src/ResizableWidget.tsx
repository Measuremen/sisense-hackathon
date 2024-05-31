import { FC, useState } from "react";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import {
  CompleteThemeSettings,
  DashboardWidget,
  WidgetModel,
} from "@sisense/sdk-ui";
import { IconButton, styled } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LeftIcon from "@mui/icons-material/ArrowBack";
import RightIcon from "@mui/icons-material/ArrowForward";

interface AppProps {
  filters: any;
  dashboardOid: string;
  widget: WidgetModel;
  themeSettings: CompleteThemeSettings;
  index: number;
  onWidgetDelete: (widget: WidgetModel) => void;
  onWidgetOrderUpdate: (currentIndex: number, newIndex: number) => void;
}

export const ResizableWidget: FC<AppProps> = ({
  filters,
  dashboardOid,
  widget,
  themeSettings,
  index,
  onWidgetDelete,
  onWidgetOrderUpdate,
}) => {
    
  const [key, setKey] = useState<string>(
    `movableWidget ${index} ${widget.oid}`
  );
  const onResize = (
    _event: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    setKey(`movableWidget ${size.width * Math.random()}`);
  };

  return (
    <StyledResizableBlock
      onResizeStop={onResize}
      width={400}
      height={300}
      minConstraints={[100, 100]}
      maxConstraints={[1000, 1000]}
      resizeHandles={["se"]}
    >
      {" "}
      <>
        <StyledLeftButton
          onClick={() => onWidgetOrderUpdate(index, index - 1)}
          aria-label="order-left"
        >
          <LeftIcon />
        </StyledLeftButton>
        <StyledRightButton
          onClick={() => onWidgetOrderUpdate(index, index + 1)}
          aria-label="order-right"
        >
          <RightIcon />
        </StyledRightButton>
        <StyledDeleteButton
          onClick={() => onWidgetDelete(widget)}
          aria-label="delete"
        >
          <DeleteIcon />
        </StyledDeleteButton>
        <DashboardWidget
          filters={filters}
          key={key}
          widgetOid={widget.oid}
          dashboardOid={dashboardOid}
          title={widget.title}
          styleOptions={themeSettings.chart}
        />
      </>
    </StyledResizableBlock>
  );
};

const StyledResizableBlock = styled(ResizableBox)({
  border: "1px solid black",
  margin: "1rem",
});

const StyledDeleteButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 30,
});

const StyledLeftButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 90,
});

const StyledRightButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 60,
});

export default ResizableWidget;
