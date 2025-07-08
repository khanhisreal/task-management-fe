import { useEffect, useState } from "react";
import { Searchbar } from "../components/common/Searchbar";
import styles from "./Overview.module.css";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { Grid } from "@mui/material";
import userClient from "../../../clients/userService";
import projectClient from "../../../clients/projectService";
import taskClient from "../../../clients/taskService";

export function Overview() {
  const [users, setUsers] = useState<{ data: number } | null>(null);
  const [projects, setprojects] = useState<{ data: number } | null>(null);
  const [tasks, setTasks] = useState<{ data: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setUsers(await userClient.get("/user/count"));
      setprojects(await projectClient.get("/project/count"));
      setTasks(await taskClient.get("/task/count"));
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Searchbar />
      <div className={styles.main}>
        <h1 className={styles.main_title}>
          <span>Overview</span>
        </h1>
        <div className={styles.main_form}>
          <Grid container spacing={3}>
            <Card sx={{ backgroundColor: "#dbeafe", borderRadius: "16px" }}>
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{users ? users.data : 0}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#fef9c3", borderRadius: "16px" }}>
              <CardContent>
                <Typography variant="h6">Total Projects</Typography>
                <Typography variant="h4">
                  {projects ? projects.data : 0}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#fee2e2", borderRadius: "16px" }}>
              <CardContent>
                <Typography variant="h6">Total Tasks</Typography>
                <Typography variant="h4">{tasks ? tasks.data : 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Latest Activities */}
          <div style={{ marginTop: "32px" }}>
            <Typography variant="h5" gutterBottom>
              Tracking Log
            </Typography>
            <List
              sx={{
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <ListItem sx={{ borderBottom: "1px solid #e5e7eb" }}>
                User John Doe registered
              </ListItem>
              <ListItem sx={{ borderBottom: "1px solid #e5e7eb" }}>
                Task "Revamp UI" marked completed
              </ListItem>
              <ListItem>5 new messages received</ListItem>
            </List>
          </div>
        </div>
      </div>
    </div>
  );
}
