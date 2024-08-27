import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByUsername } from "../api/authApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { format } from 'date-fns';
import Loading from "../components/Loading";

const UserProfile = () => {
  const { username } = useParams();
  const [data, setUserData] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [loading, setLoading] = useState(true); 
  const userData = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (username) {
          setLoading(true); 
          const data = await getUserByUsername(username, userData.token);
          setUserData(data);
          setFormattedDate(format(new Date(data.createdAt), 'MMMM dd, yyyy HH:mm:ss'));
        }
      } catch (err) {
        console.error(err.message);
        toast.error(err.message || "Failed to load user data");
      } finally {
        setLoading(false); 
      }
    };
    fetchUserData();
  }, [username]); 
  
  if (loading) {
    return <Loading />; 
  }

  return (
    <>
      {data?.username ? (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {data?.firstName} {data?.lastName}
                </Typography>
                <Typography color="textSecondary">
                  @{data?.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  User Since: {formattedDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default UserProfile;
