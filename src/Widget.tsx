import { FC } from "react";

import "react-resizable/css/styles.css";
import { CompleteThemeSettings, WidgetModel } from "@sisense/sdk-ui";
import MovingWidget from "./MovingWidget";
import ResizableWidget from "./ResizableWidget";

interface AppProps {
  dashboardOid: string;
  filters: any;
  isMoveMode: boolean;
  widget: WidgetModel;
  left?: number;
  top?: number;
  index: number;
  themeSettings: CompleteThemeSettings;
  onWidgetDelete: (widget: WidgetModel) => void;
  onWidgetOrderUpdate: (currentIndex: number, newIndex: number) => void;
}

export const Widget: FC<AppProps> = ({
  filters,
  dashboardOid,
  index,
  widget,
  isMoveMode = false,
  left = 0,
  top = 0,
  themeSettings,
  onWidgetDelete,
  onWidgetOrderUpdate,
}) => {
  return isMoveMode ? (
    <MovingWidget
      filters={filters}
      onWidgetDelete={onWidgetDelete}
      themeSettings={themeSettings}
      dashboardOid={dashboardOid}
      widget={widget}
      left={left}
      top={top}
    />
  ) : (
    <ResizableWidget
      filters={filters}
      index={index}
      onWidgetDelete={onWidgetDelete}
      themeSettings={themeSettings}
      onWidgetOrderUpdate={onWidgetOrderUpdate}
      dashboardOid={dashboardOid}
      widget={widget}
    />
  );
};

export default Widget;
