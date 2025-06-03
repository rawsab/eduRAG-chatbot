import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  TextField,
  Snackbar,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";

const drawerWidth = 340;

const filesMock = [
  { name: "Bangladesh.pdf", id: 1 },
  { name: "Math101.txt", id: 2 },
];

const qaHistoryMock = [
  { role: "user", text: "What is the history of Bangladesh?" },
  { role: "bot", text: "Bangladesh has a rich history..." },
  { role: "user", text: "What is the capital?" },
  { role: "bot", text: "Dhaka is the capital city." },
];

export default function App() {
  const [sidebarTab, setSidebarTab] = useState(0); // 0: Upload, 1: Notes
  const [fileList, setFileList] = useState(filesMock); // Replace with API data
  const [qaHistory, setQaHistory] = useState(qaHistoryMock); // Now with role
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Placeholder upload handler
  const handleFileUpload = (e) => {
    setSnackbar({ open: true, message: "File uploaded! (mock)" });
  };

  // Send handler with role-based chat
  const handleSend = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setQaHistory((prev) => [...prev, { role: "user", text: question }]);
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      setQaHistory((prev) => [
        ...prev,
        { role: "bot", text: "(mock) This is a generated answer." },
      ]);
    }, 1200);
    setQuestion("");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFF1EC" }}>
      <CssBaseline />
      {/* AppBar/Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "white",
          color: "#FF6331",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <MenuBookIcon sx={{ color: "#FF6331", mr: 1 }} fontSize="large" />
          <Typography variant="h5" fontWeight={700} color="#FF6331" noWrap>
            EduRAG
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      {/* Sidebar/Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "white",
            borderRight: "1px solid #eee",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Tabs
            value={sidebarTab}
            onChange={(_, v) => setSidebarTab(v)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Upload" />
            <Tab label="Notes" />
          </Tabs>
          {sidebarTab === 0 && (
            <Box>
              <Button
                variant="contained"
                component="label"
                color="warning"
                sx={{ bgcolor: "#FF6331", color: "white", mb: 2 }}
                fullWidth
              >
                Upload Lecture Notes
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          )}
          {sidebarTab === 1 && (
            <Box>
              <Typography fontWeight={500} mb={1} color="#0A0713">
                Uploaded Files
              </Typography>
              <List dense>
                {fileList.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      borderRadius: 1,
                      "&:hover": { bgcolor: "#F6F6F6" },
                      cursor: "pointer",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "#7977EF",
                          color: "white",
                          width: 28,
                          height: 28,
                        }}
                      >
                        {file.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
              <Box
                mt={3}
                p={2}
                sx={{
                  bgcolor: "#F6F6F6",
                  borderRadius: 2,
                  minHeight: 120,
                  textAlign: "center",
                  color: "#bbb",
                }}
              >
                PDF/Text viewer with highlights and bookmarks (coming soon)
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#FFF1EC",
        }}
      >
        <Toolbar />
        {/* Chatbot Main Area */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {qaHistory.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  bgcolor: msg.role === "user" ? "#FF6331" : "#F6F6F6",
                  color: msg.role === "user" ? "white" : "black",
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: 1,
                  mb: 2,
                }}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          {isBotTyping && (
            <Box alignSelf="flex-start" maxWidth="70%">
              <Paper
                elevation={2}
                sx={{
                  bgcolor: "#FF6331",
                  color: "white",
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: 1,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={18} sx={{ color: "white", mr: 1 }} />
                <Typography fontStyle="italic">EduRAG is typing...</Typography>
              </Paper>
            </Box>
          )}
        </Box>
        {/* Chat input */}
        <Box
          sx={{ px: 4, py: 2, bgcolor: "white", borderTop: "1px solid #eee" }}
        >
          <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
            <TextField
              placeholder="Ask a question about your notes..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              size="small"
              sx={{ bgcolor: "#FFF1EC", borderRadius: 1 }}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              sx={{ bgcolor: "#FF6331", color: "white" }}
            >
              Send
            </Button>
          </form>
        </Box>
        {/* Footer */}
        <Box
          component="footer"
          py={1.5}
          textAlign="center"
          fontSize={14}
          color="#888"
          bgcolor="white"
          borderTop="1px solid #eee"
        >
          Built by Rawsab Said
        </Box>
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbar({ ...snackbar, open: false })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );
}
