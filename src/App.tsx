import { FC, useState, useEffect } from 'react';
import Menu from './Menu';
import { Dashboard } from './Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Box, Drawer, IconButton, Toolbar, Typography, styled, SelectChangeEvent, FormControlLabel, Switch, Button } from '@mui/material';
import {
  useGetDashboardModel,
  WidgetModel,
  useGetDashboardModels,
  useThemeContext
} from '@sisense/sdk-ui';

const drawerWidth = 600;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface AppProps {
}

export const App: FC<AppProps> = () => {
  const [isMoveMode, setIsMoveMode] = useState(false);
  const [dashboardOid, setDashboardOid] = useState<string>('');
  const [dashboardWidgets, setDashboardWidgets] = useState<WidgetModel[]>([]);
  const [open, setOpen] = useState(true);
  const { dashboards, isLoading: isDashboardsLoading, isError: isDashboardsError } = useGetDashboardModels();
  const { themeSettings } = useThemeContext();
  const { dashboard, isLoading, isError } = useGetDashboardModel({
    includeWidgets: true,
    dashboardOid,
  });

  useEffect(() => {
    if (dashboardOid === '' && dashboards && dashboards.length > 0) {
      setDashboardOid(dashboards[0].oid);
    }
  }, [dashboards]);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMoveMode(event.target.checked);
  };


  const handleWidgetDelete = (widget: WidgetModel) => {
    const clonedDashboardWidgets = [...dashboardWidgets];
    clonedDashboardWidgets.splice(dashboardWidgets.findIndex(i => i.oid === widget.oid), 1);
    setDashboardWidgets(clonedDashboardWidgets);
  }

  const handleWidgetOrderUpdate = (currentIndex: number, newIndex: number) => {
    if (newIndex !== -1 && newIndex !== dashboardWidgets.length) {
      setDashboardWidgets(widgets => {
        const currentItem = widgets[currentIndex];
        widgets[currentIndex] = widgets[newIndex];
        widgets[newIndex] = currentItem;
        return [...widgets];
      })
    }
  }

  const handleMenuItemDrop = (item: WidgetModel) => {
    setDashboardWidgets((widgets) => {
      const ifExist = widgets.find(dW => dW.oid === item.oid);
      if (ifExist) {
        ifExist && alert('Widget Already Exist in Dashboard!');
        return widgets;
      } else {
        return [...widgets, item];
      }
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleRemoveAllWidgets = () => {
    setDashboardWidgets([]);
  };

  const handleDashboardChange = (event: SelectChangeEvent) => {
    setDashboardOid(event.target.value as string);
  };

  if (isError || isDashboardsError) {
    return <>Error!</>;
  }
  if (isLoading || isDashboardsLoading) {
    return <>Loading...</>;
  }

  return (
    <MainPage>
      <AppBar open={open} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Customizable Dashboard
          </Typography>
          <ModeSwitchBlock>
            <FormControlLabel control={
              <><span>Enable resize mode</span><Switch color="default" onChange={handleModeChange} checked={isMoveMode} /></>
            } label="Enable free-move mode" />
          </ModeSwitchBlock>
          <Button onClick={handleRemoveAllWidgets} color='warning' variant="contained">Remove all widgets</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Menu
          onDashboardChange={handleDashboardChange}
          dashboards={dashboards}
          themeSettings={themeSettings}
          menuItems={dashboard?.widgets || []}
          dashboardOid={dashboard.oid}
          onItemDrop={handleMenuItemDrop} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Dashboard isMoveMode={isMoveMode} onWidgetOrderUpdate={handleWidgetOrderUpdate} themeSettings={themeSettings} onWidgetDelete={handleWidgetDelete} dashboardOid={dashboard.oid}
          dashboardWidgets={dashboardWidgets} />
      </Main>
    </MainPage>
  );
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MainPage = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: '100%',
  height: '100%',
});

const ModeSwitchBlock = styled('div')({ margin: '0 3rem' });

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default App;
