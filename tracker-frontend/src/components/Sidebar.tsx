import { NavLink, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Article as ArticleIcon,
  DescriptionRounded as LogoIcon,
  SettingsOutlined as SettingsIcon,
} from "@mui/icons-material";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MINI } from "../theme";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

function Sidebar({ open, onNavigate }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMini = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const location = useLocation();

  const onArticles = location.pathname.startsWith("/articles");
  const width = isMini ? SIDEBAR_WIDTH_MINI : SIDEBAR_WIDTH;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onNavigate}
      sx={{
        flexShrink: 0,
        width,
        "& .MuiDrawer-paper": {
          width,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
        },
      }}
    >
      <Box
        sx={{
          width,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          transition: "width 0.2s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: isMini ? 1.25 : 2.25,
            pb: 2.25,
            pt: 1,
            justifyContent: isMini ? "center" : "flex-start",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <LogoIcon sx={{ width: 18, height: 18 }} />
          </Box>
          {!isMini && (
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 650,
                color: "text.primary",
                letterSpacing: -0.2,
              }}
            >
              Tracker
            </Typography>
          )}
        </Box>

        <Divider />

        <List
          sx={{
            px: 1.25,
            py: 1.25,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {!isMini && (
            <Typography
              sx={{
                px: 1,
                pb: 0.75,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: "text.disabled",
              }}
            >
              Browse
            </Typography>
          )}
          <Tooltip
            title="Articles"
            placement="right"
            disableHoverListener={!isMini}
          >
            <ListItemButton
              component={NavLink}
              to="/articles"
              selected={onArticles}
              onClick={onNavigate}
              sx={{
                borderRadius: 1,
                py: 0.75,
                minHeight: 40,
                justifyContent: isMini ? "center" : "flex-start",
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isMini ? 0 : 1.25,
                  color: "inherit",
                }}
              >
                <ArticleIcon sx={{ width: 20, height: 20 }} />
              </ListItemIcon>
              {!isMini && (
                <ListItemText
                  primary="Articles"
                  slotProps={{
                    primary: {
                      color: "inherit",
                      sx: { fontSize: 14, fontWeight: 600 },
                    },
                  }}
                  sx={{ my: 0 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </List>

        <Box sx={{ mt: "auto", pb: 0.5 }}>
          <Divider />
          <Tooltip
            title="Settings"
            placement="right"
            disableHoverListener={!isMini}
          >
            <Box
              component="button"
              type="button"
              onClick={onNavigate}
              sx={{
                mt: 1,
                px: isMini ? 1 : 1.75,
                py: 0.75,
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                justifyContent: isMini ? "center" : "flex-start",
                border: "none",
                background: "transparent",
                borderRadius: 1,
                cursor: "pointer",
                textAlign: "left",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  fontWeight: 650,
                  bgcolor: "#6366f1",
                  flex: "none",
                }}
              >
                NM
              </Avatar>
              {!isMini && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                    noWrap
                  >
                    Nguyen Minh
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "text.disabled" }}
                    noWrap
                  >
                    Viewer
                  </Typography>
                </Box>
              )}
              {!isMini && (
                <SettingsIcon
                  sx={{ width: 17, height: 17, color: "text.disabled" }}
                />
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
