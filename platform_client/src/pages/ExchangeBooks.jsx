import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  getReceivedBookExchanges,
  getSentBookExchanges,
  acceptBookExchange,
  refuseBookExchange,
} from "../api/bookExchange";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Loading from "../components/Loading";

const ExchangeBooks = () => {
  const { username, token } = useSelector((state) => state.auth);
  const [receivedExchanges, setReceivedExchanges] = useState([]);
  const [sentExchanges, setSentExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => {
      setLoading(true);
      try {
        const receivedData = await getReceivedBookExchanges(username, token);
        setReceivedExchanges(receivedData);
        const sentData = await getSentBookExchanges(username, token);
        setSentExchanges(sentData);
      } catch (error) {
        console.error("Error fetching book exchanges:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchExchanges();
  }, [username, token]);

  const handleAccept = async (exchangeId) => {
    try {
      await acceptBookExchange(exchangeId, token);
      setReceivedExchanges(
        receivedExchanges.filter((exchange) => exchange._id !== exchangeId)
      );
    } catch (error) {
      console.error("Error accepting book exchange:", error);
    }
  };

  const handleRefuse = async (exchangeId) => {
    try {
      await refuseBookExchange(exchangeId, token);
      setReceivedExchanges(
        receivedExchanges.filter((exchange) => exchange._id !== exchangeId)
      );
    } catch (error) {
      console.error("Error refusing book exchange:", error);
    }
  };

  if (loading) {
    return <Loading />; // Show loading component while fetching data
  }


  return (
    <div style={{ color: "#333", backgroundColor: "#f0f0f0", padding: "20px" }}>
      <h2>Received Book Exchange Requests</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Requested</TableCell>
              <TableCell>Book Received</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivedExchanges.map((exchange) => (
              <TableRow key={exchange._id}>
                <TableCell>
                  <List>
                    <ListItem>
                    <ListItemText
                        primary={exchange.bookIdAskedFor.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdAskedFor.author}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdAskedFor.genre.join(",")}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </TableCell>
                <TableCell>
                  <List>
                    <ListItem>
                    <ListItemText
                        primary={exchange.bookIdSent.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdSent.author}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdSent.genre.join(",")}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/user/${exchange.fromUsername}`}
                    variant="body2"
                  >
                    {exchange.fromUsername}
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAccept(exchange._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRefuse(exchange._id)}
                  >
                    Refuse
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Sent Book Exchange Requests</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Sent</TableCell>
              <TableCell>Book Received</TableCell>
              <TableCell>Sent To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sentExchanges.map((exchange) => (
              <TableRow key={exchange._id}>
                <TableCell>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={exchange.bookIdSent.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdSent.author}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdSent.genre.join(",")}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </TableCell>
                <TableCell>
                  <List>
                    <ListItem>
                    <ListItemText
                        primary={exchange.bookIdAskedFor.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdAskedFor.author}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              display="block"
                            >
                              {exchange.bookIdAskedFor.genre.join(",")}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/user/${exchange.toUsername}`}
                    variant="body2"
                  >
                    {exchange.toUsername}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ExchangeBooks;
