import {FC} from 'react';
import {useDrag} from 'react-dnd';
import {CompleteThemeSettings, DashboardWidget, WidgetModel} from '@sisense/sdk-ui';
import {styled} from '@mui/material';

interface AppProps {
    widget: WidgetModel;
    dashboardOid: string;
    onItemDrop: (item: WidgetModel) => void;
    themeSettings: CompleteThemeSettings;
}

export interface Dropzone {
  name: string;
}

export const MenuItem: FC<AppProps> = ({onItemDrop, widget, dashboardOid, themeSettings}) => {
    const [{opacity}, dragRef] = useDrag(
        () => ({
            type: 'menu-item',
            item: {widget},
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1
            }),
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult<Dropzone>()
                if (item && dropResult) {
                    onItemDrop(widget)
                }
            },
        }),
        []
    );

    return (
        <MenuWidget ref={dragRef} style={{opacity}}>
            <DashboardWidget 
              widgetOid={widget.oid} 
              dashboardOid={dashboardOid} 
              title={widget.title}
              styleOptions={themeSettings.chart}/>
        </MenuWidget>
    )
}

const MenuWidget = styled('div')({
    padding: '1rem',
    border: '1px solid black',
    margin: '1rem',
    borderRadius: '15px',
    boxShadow: '5px 10px 10px grey'
})

export default MenuItem;
