import { FC } from "react";
import {
  CompleteThemeSettings,
  DashboardWidget,
  WidgetModel,
} from "@sisense/sdk-ui";
import { useDrag } from "react-dnd";
import { IconButton, styled } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface AppProps {
  dashboardOid: string;
  widget: WidgetModel;
  left?: number;
  top?: number;
  themeSettings: CompleteThemeSettings;
  onWidgetDelete: (widget: WidgetModel) => void;
  filters: any;
}

export const MovingWidget: FC<AppProps> = ({
  filters,
  dashboardOid,
  widget,
  left = 0,
  top = 0,
  themeSettings,
  onWidgetDelete,
}) => {
  const [, drag] = useDrag(
    () => ({
      type: "dashboard-item",
      item: { id: widget.oid, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [widget.oid, left, top]
  );

  return (
    <StyledMovingWidget
      key={widget.oid + "widgetDasboardBlock"}
      style={{ position: "absolute", left, top }}
      ref={drag}
    >
      <StyledDeleteButton
        onClick={() => onWidgetDelete(widget)}
        aria-label="delete"
      >
        <DeleteIcon />
      </StyledDeleteButton>
      <DashboardWidget
        filters={filters}
        key={widget.oid + "widgetDashboard"}
        widgetOid={widget.oid}
        dashboardOid={dashboardOid}
        title={widget.title}
        styleOptions={themeSettings.chart}
      />
    </StyledMovingWidget>
  );
};

const StyledMovingWidget = styled("div")({
  border: "1px solid black",
  margin: "1rem",
});

const StyledDeleteButton = styled(IconButton)({
  position: "absolute",
  top: 0,
  right: 30,
});

export default MovingWidget;
