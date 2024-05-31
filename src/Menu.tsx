import { FC, useState } from 'react';
import MenuItem from './MenuItem';
import { Divider, Select, MenuItem as MUISelectItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { CompleteThemeSettings, DashboardModel, WidgetModel } from '@sisense/sdk-ui';

interface MenuProps {
  menuItems: WidgetModel[];
  onItemDrop: (item: WidgetModel) => void;
  dashboards: DashboardModel[];
  dashboardOid: string;
  themeSettings: CompleteThemeSettings;
  onDashboardChange: (event: SelectChangeEvent) => void;
}

export const Menu: FC<MenuProps> = ({ onItemDrop, dashboardOid, menuItems = [], themeSettings, onDashboardChange, dashboards }) => {
  const [selectedWidgetType, setSelectedWidgetType] = useState<string>('all');
  const handleWidgetTypeChange = (event: SelectChangeEvent) => {
    setSelectedWidgetType(event.target.value as string);
  };

  const menuItemsWithUniqueOid = menuItems.filter((item, index) => menuItems.findIndex(i => i.oid === item.oid) === index);
  const widgetTypes = [...new Set(menuItems.map(x => x.widgetType))];
  const filteredMenuItems = selectedWidgetType && selectedWidgetType !== 'all'
    ? menuItemsWithUniqueOid.filter(item => item.widgetType === selectedWidgetType)
    : menuItemsWithUniqueOid;

  return (
    <>
      <Divider />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: "10px 20px",
      }}>
        <FormControl variant="outlined">
          <InputLabel>Dashboard selector</InputLabel>
          <Select
            value={dashboardOid}
            onChange={onDashboardChange}
            label="Dashboard selector"
            style={{ minWidth: "300px", marginLeft: 'auto' }}
          >
            {dashboards.filter((d, index) => dashboards.findIndex(i => i.oid === d.oid) === index).map((dash: DashboardModel) => (
              <MUISelectItem key={dash.oid} value={dash.oid} sx={{ ml: 2, mr: 2 }}>
                {dash.title}
              </MUISelectItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Widget Type</InputLabel>
          <Select
            value={selectedWidgetType}
            onChange={handleWidgetTypeChange}
            label="Widget Type"
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <MUISelectItem value="all">All</MUISelectItem>
            {widgetTypes.map(type => (<MUISelectItem value={type}>{type}</MUISelectItem>))}
          </Select>
        </FormControl>
      </div>
      <Divider />
      {filteredMenuItems.length > 0 &&
        filteredMenuItems.map((item, index) => item.chartType && (
          <MenuItem
            dashboardOid={dashboardOid}
            key={'menuWidget-' + index}
            widget={item}
            onItemDrop={onItemDrop}
            themeSettings={themeSettings}
          />
        ))}
    </>
  );
};

export default Menu;
