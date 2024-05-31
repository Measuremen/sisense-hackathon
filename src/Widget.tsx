import { FC } from 'react';

import 'react-resizable/css/styles.css';
import { CompleteThemeSettings, WidgetModel } from '@sisense/sdk-ui';
import MovingWidget from './MovingWidget';
import ResizableWidget from './ResizableWidget';

interface AppProps {
    dashboardOid: string;
    isMoveMode: boolean;
    widget: WidgetModel;
    left?: number;
    top?: number;
    index: number;
    themeSettings: CompleteThemeSettings;
    onWidgetDelete: (widget: WidgetModel) => void;
    onWidgetOrderUpdate: (currentIndex: number, newIndex: number) => void;
}

export const Widget: FC<AppProps> = ({ dashboardOid, index, widget, isMoveMode = false, left = 0, top = 0, themeSettings, onWidgetDelete, onWidgetOrderUpdate }) => {
    return isMoveMode
        ? (<MovingWidget
            onWidgetDelete={onWidgetDelete}
            themeSettings={themeSettings}
            dashboardOid={dashboardOid}
            widget={widget}
            left={left}
            top={top} />)
        : (<ResizableWidget
            index={index}
            onWidgetDelete={onWidgetDelete}
            themeSettings={themeSettings}
            onWidgetOrderUpdate={onWidgetOrderUpdate}
            dashboardOid={dashboardOid}
            widget={widget} />);
};

export default Widget;
