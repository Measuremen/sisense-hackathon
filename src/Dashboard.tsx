import { FC, useCallback, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import 'react-resizable/css/styles.css';
import { CompleteThemeSettings, WidgetModel } from '@sisense/sdk-ui';
import { Widget } from './Widget.tsx';
import { styled } from '@mui/material';
import ExportButton from './export.tsx';
import ExportPDF from './exportPdf.tsx';

interface DashboardProps {
  isMoveMode: boolean;
  dashboardWidgets: WidgetModel[];
  dashboardOid: string;
  themeSettings: CompleteThemeSettings;
  onWidgetDelete: (widget: WidgetModel) => void;
  onWidgetOrderUpdate: (currentIndex: number, newIndex: number) => void;
}

export interface DragItem {
  type: string;
  id: string;
  top: number;
  left: number;
}


export const Dashboard: FC<DashboardProps> = ({ isMoveMode, onWidgetDelete, dashboardWidgets = [], dashboardOid, themeSettings, onWidgetOrderUpdate }) => {
  const [widgetPositions, setWidgetPositions] = useState<{
    [key: string]: {
      top: number;
      left: number;
    }
  }>({});

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      widgetPositions[id] = {left, top};
      setWidgetPositions(widgetPositions);
    },
    [widgetPositions, setWidgetPositions],
  );
  
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ['menu-item', 'dashboard-item'],
    drop(item: DragItem, monitor) {
      if (item.id) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round((item.left || 0) + delta.x);
        const top = Math.round((item.top || 0) + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      }
      return { name: 'Dashboard' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let borderColor = 'white';
  if (isActive) {
    borderColor = 'black';
  } else if (canDrop) {
    borderColor = '#c2c2c2';
  }

  return (
    <DashboardBlock ref={drop} >
      {!dashboardWidgets.length && <p>{isActive ? 'Release in dotted area' : 'Drag a widget here'}</p>}
      <br />
      <DashboardWidgetsBlock style={{ border: `1px dashed ${borderColor}` }} >
        {!!dashboardWidgets.length && dashboardWidgets.map((widget, index) => (
          <DashboardWidgetsItem key={"dashboardWidget" + index}>
            <Widget
              onWidgetOrderUpdate={onWidgetOrderUpdate}
              onWidgetDelete={onWidgetDelete}
              index={index}
              themeSettings={themeSettings} 
              left={widgetPositions[widget.oid] ? widgetPositions[widget.oid].left : index * 30} 
              top={widgetPositions[widget.oid] ? widgetPositions[widget.oid].top : index * 30} 
              isMoveMode={isMoveMode} 
              widget={widget} 
              dashboardOid={dashboardOid} />
          </DashboardWidgetsItem>
        ))}
      </DashboardWidgetsBlock>
      <ExportButton />
      <ExportPDF />
    </DashboardBlock>
  )
}

const DashboardBlock = styled('div')({
  width: '100%',
  height: '100%'
});

const DashboardWidgetsItem = styled('div')({
  display: 'inline-block'
});

const DashboardWidgetsBlock = styled('div')({
  width: '100%',
  position: 'relative',
  minHeight: '80%',
  padding: '4rem'
});

export default Dashboard;
