import React, { FC } from "react";
import { useDrop, XYCoord } from "react-dnd";
import "react-resizable/css/styles.css";
import { Widget } from "./Widget.tsx";
import { styled } from "@mui/material";
import { useState } from "react";
import { Filter, createAttribute } from "@sisense/sdk-data";
import {
  CompleteThemeSettings,
  MemberFilterTile,
  WidgetModel,
  DateRangeFilterTile,
  RelativeDateFilterTile,
} from "@sisense/sdk-ui";

interface DashboardProps {
  isMoveMode: boolean;
  dashboardWidgets: WidgetModel[];
  dashboardOid: string;
  themeSettings: CompleteThemeSettings;
  onWidgetDelete: (widget: WidgetModel) => void;
  onWidgetOrderUpdate: (currentIndex: number, newIndex: number) => void;
  widgetPositions: WidgetPositions;
  moveBox: (id: string, left: number, top: number) => void;
  color: string;
}

export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
}

export interface WidgetPositions {
  [key: string]: {
    top: number;
    left: number;
  };
}

export const Dashboard: FC<DashboardProps> = ({
  isMoveMode,
  moveBox,
  widgetPositions,
  onWidgetDelete,
  dashboardWidgets = [],
  dashboardOid,
  themeSettings,
  onWidgetOrderUpdate,
}) => {
  const [filter, setFilter] = useState<any>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter | null>(null);
  const activeFilters: Filter[] = [filter, dateRangeFilter].filter((f) => {
    // make sure no filters are undefined
    if (f) return f;
  }) as Filter[];
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["menu-item", "dashboard-item"],
    drop(item: DragItem, monitor) {
      if (item.id) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round((item.left || 0) + delta.x);
        const top = Math.round((item.top || 0) + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      }
      return { name: "Dashboard" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let borderColor = "white";
  if (isActive) {
    borderColor = "black";
  } else if (canDrop) {
    borderColor = "#c2c2c2";
  }

  const getAttributesFromWidgets = (): any[] => {
    const attributes: any[] = [];

    dashboardWidgets.forEach((widget) => {
      const widgetAttributes = widget.dataOptions?.category;

      if (widgetAttributes && Array.isArray(widgetAttributes)) {
        attributes.push(...widgetAttributes);
      }
    });

    return attributes;
  };
  const attributesData = getAttributesFromWidgets();

  return (
    <DashboardBlock id="print-box" ref={drop}>
      {!dashboardWidgets.length && (
        <p>{isActive ? "Release in dotted area" : "Drag a widget here"}</p>
      )}
      <br />
      <DashboardWidgetsBlock style={{ border: `1px dashed ${borderColor}` }}>
        {!!dashboardWidgets.length &&
          dashboardWidgets.map((widget, index) => (
            <DashboardWidgetsItem key={"dashboardWidget" + index}>
              <Widget
                filters={activeFilters}
                onWidgetOrderUpdate={onWidgetOrderUpdate}
                onWidgetDelete={onWidgetDelete}
                index={index}
                themeSettings={themeSettings}
                left={
                  widgetPositions[widget.oid]
                    ? widgetPositions[widget.oid].left
                    : index * 30
                }
                top={
                  widgetPositions[widget.oid]
                    ? widgetPositions[widget.oid].top
                    : index * 30
                }
                isMoveMode={isMoveMode}
                widget={widget}
                dashboardOid={dashboardOid}
              />
            </DashboardWidgetsItem>
          ))}
      </DashboardWidgetsBlock>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          width: 300,
          height: "100%",
          position: "fixed",
          top: 50,
          right: 0,
          background: "#fff",
          borderLeft: " 1px solid #e0e0e0",
          paddingLeft: "20px",
          paddingTop: 40,
        }}
      >
        {attributesData?.length > 0 &&
          attributesData?.map((attribute, index) => {
            if (attribute?.column?.type == "text-attribute") {
              return (
                <div key={`memberFilter_${index}`}>
                  <MemberFilterTile
                    title={attribute.column._name}
                    attribute={createAttribute({
                      name: attribute?.column?._name,
                      description: attribute?.column?.description || "",
                      expression: attribute?.column?.expression || "",
                    })}
                    dataSource={"Sample Healthcare"}
                    filter={filter}
                    onChange={setFilter}
                  />
                </div>
              );
            } else if (attribute?.column?.type == "datelevel")
              return (
                <div key={`memberFilter_${index}`}>
                  {dateRangeFilter ? (
                    <RelativeDateFilterTile
                      title={attribute.column._name}
                      attribute={createAttribute({
                        name: attribute?.column?._name,
                        description: attribute?.column?.description || "",
                        expression: attribute?.column?.expression || "",
                      })}
                      dataSource={"Sample Healthcare"}
                      filter={dateRangeFilter}
                      onChange={(filter: Filter) => {
                        setDateRangeFilter(filter);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              );
          })}
      </div>
    </DashboardBlock>
  );
};

const DashboardBlock = styled("div")({
  width: "100%",
  height: "100%",
});

const DashboardWidgetsItem = styled("div")({
  display: "inline-block",
});

const DashboardWidgetsBlock = styled("div")({
  width: "100%",
  position: "relative",
  minHeight: "80%",
  padding: "4rem",
});

export default Dashboard;
