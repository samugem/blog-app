import {
  Typography,
  Alert,
  List,
  Stack,
  ListItem,
  Container,
  Button,
  Card,
  CardMedia,
  Box,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import "./App.css";
import SignIn from "./SignIn";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: number;
  header: string;
  content: string;
  imgUrl: string;
  updatedAt: Date;
  timestamp: Date;
  liked: number;
  disliked: number;
}

interface ApiData {
  blogPosts: BlogPost[];
  error: string;
  fetched: boolean;
}
interface FetchSettings {
  method: string;
  headers?: any;
  body?: string;
}
interface Props {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  userId: number;
  setUserId: Dispatch<SetStateAction<number>>;
}

const Main: React.FC<Props> = (props: Props): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchPosts = async (settings: FetchSettings): Promise<void> => {
    try {
      const connection = await fetch(`/api/blog-posts`, settings);

      if (connection.status === 200) {
        const blogPosts = await connection.json();

        if (blogPosts.length < 1) {
          setApiData({
            ...apiData,
            error: "Ei blogi postauksia",
            fetched: true,
          });
        } else {
          setApiData({
            ...apiData,
            blogPosts: blogPosts,
            error: "",
            fetched: true,
          });
        }
      } else {
        let errorMsg: string = "";

        switch (connection.status) {
          case 401:
            errorMsg = "Virheellinen token";
            break;
          default:
            errorMsg = "Palvelimella tapahtui odottamaton virhe";
            break;
        }

        setApiData({
          ...apiData,
          error: errorMsg,
          fetched: true,
        });
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetched: true,
      });
    }
  };

  const apiCall = async (
    method?: string,
    likedislike?: string,
    id?: number
  ): Promise<void> => {
    let settings: FetchSettings = {
      method: method || "GET",
    };
    if (likedislike) {
      try {
        await fetch(`/api/blog-posts/${likedislike}/${id}`, settings);
        settings = {
          method: "GET",
        };
        fetchPosts(settings);
      } catch (e: any) {
        setApiData({
          ...apiData,
          error: "Palvelimeen ei saada yhteyttä",
          fetched: true,
        });
      }
    } else {
      settings = {
        method: "GET",
      };
      fetchPosts(settings);
    }
  };

  const handleOpenSignIn = () => {
    if (openSignIn === false) {
      setOpenSignIn(true);
    }
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const handleSignOut = async () => {
    props.setToken("");
    props.setUserId(-1);
    props.setUsername("");
  };

  useEffect(() => {
    apiCall();
  }, []);
  return (
    <Container>
      <Typography variant="h4" textAlign="center">
        Blogi
      </Typography>
      <SignIn
        openSignIn={openSignIn}
        handleClose={handleCloseSignIn}
        setToken={props.setToken}
        setUsername={props.setUsername}
        setUserId={props.setUserId}
        setOpenSignIn={setOpenSignIn}
      />

      {props.token ? (
        <Box
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => navigate("/admin")}>Hallintapaneeli</Button>
          <Button onClick={() => handleSignOut()}>Kirjaudu ulos</Button>{" "}
          <Typography variant="h5">{props.username}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => handleOpenSignIn()}>Kirjaudu</Button>
        </Box>
      )}

      <Stack>
        {Boolean(String(apiData.error) === "Ei blogi postauksia") ? (
          <Alert severity="info">{apiData.error}</Alert>
        ) : Boolean(apiData.error) ? (
          <Alert severity="error">{apiData.error}</Alert>
        ) : apiData.fetched ? (
          <List>
            {apiData.blogPosts.map((blogPosts: BlogPost, idx: number) => {
              const timestamp = format(
                new Date(blogPosts.timestamp),
                "dd.MM.yyyy' 'HH:mm"
              );
              const updatedAt = format(
                new Date(blogPosts.updatedAt),
                "dd.MM.yyyy' 'HH:mm"
              );
              return (
                <ListItem key={idx}>
                  <Card sx={{ width: "100%", padding: 5, mb: 2 }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "600" }}>
                      {blogPosts.header}
                    </Typography>
                    <Typography variant="subtitle2">
                      {timestamp}
                      {timestamp !== updatedAt
                        ? `  (Muokattu ${updatedAt})`
                        : null}
                    </Typography>
                    {blogPosts?.imgUrl ? (
                      <CardMedia
                        component="img"
                        image={blogPosts?.imgUrl}
                        alt={`img ${idx}`}
                      ></CardMedia>
                    ) : null}
                    <Typography key={idx} variant="body1">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: blogPosts.content,
                        }}
                      ></span>
                    </Typography>{" "}
                    <Button
                      onClick={() => apiCall("PUT", "like", blogPosts.id)}
                    >
                      <ThumbUpIcon fontSize="small" />
                      {` Hyvin sanottu (${blogPosts.liked})`}
                    </Button>
                    <Button
                      onClick={() => apiCall("PUT", "dislike", blogPosts.id)}
                    >
                      <ThumbDownIcon fontSize="small" />
                      {` En ole samaa mieltä (${blogPosts.disliked})`}
                    </Button>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        ) : null}
      </Stack>
    </Container>
  );
};

export default Main;
