import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Stack,
  Paper,
} from "@mui/material";
import { projectApi, taskApi, userApi } from "../../../api";
import { useCountUp } from "../../../hooks/useCountUp";
import Layout from "../../../layout/Layout";

export default function Overview() {
  const [usersCount, setUsersCount] = useState<{ data: number } | null>(null);
  const [projectsCount, setProjectsCount] = useState<{ data: number } | null>(
    null
  );
  const [tasksCount, setTasksCount] = useState<{ data: number } | null>(null);

  const usersAnimated = useCountUp(usersCount ? usersCount.data : 0);
  const projectsAnimated = useCountUp(projectsCount ? projectsCount.data : 0);
  const tasksAnimated = useCountUp(tasksCount ? tasksCount.data : 0);

  useEffect(() => {
    const fetchData = async () => {
      setUsersCount(await userApi.get("/user/count"));
      setProjectsCount(await projectApi.get("/project/count"));
      setTasksCount(await taskApi.get("/task/count"));
    };
    fetchData();
  }, []);

  const handleFilterClick = () => {
    console.log("Filter button clicked on Overview");
  };

  return (
    <Layout
      title="Overview"
      subtitle="System Insights"
      onFilterClick={handleFilterClick}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
            <Card
              sx={{ backgroundColor: "#dbeafe", borderRadius: "16px", flex: 1 }}
            >
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{usersAnimated}</Typography>
              </CardContent>
            </Card>

            <Card
              sx={{ backgroundColor: "#fef9c3", borderRadius: "16px", flex: 1 }}
            >
              <CardContent>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h4">{projectsAnimated}</Typography>
              </CardContent>
            </Card>

            <Card
              sx={{ backgroundColor: "#fee2e2", borderRadius: "16px", flex: 1 }}
            >
              <CardContent>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h4">{tasksAnimated}</Typography>
              </CardContent>
            </Card>
          </Stack>

          <Typography
            variant="h5"
            sx={{ fontSize: "20px", fontWeight: 700, mb: 2 }}
          >
            Tracking Log
          </Typography>

          <List sx={{ backgroundColor: "#f3f4f6", borderRadius: "12px", p: 2 }}>
            <ListItem sx={{ borderBottom: "1px solid #e5e7eb" }}>
              User John Doe registered
            </ListItem>
            <ListItem sx={{ borderBottom: "1px solid #e5e7eb" }}>
              Task "Revamp UI" marked completed
            </ListItem>
            <ListItem>5 new messages received</ListItem>
          </List>
        </Box>
      </Paper>
    </Layout>
  );
}
