import {
  Typography,
  Alert,
  List,
  Stack,
  ListItem,
  Container,
  Button,
  Card,
  Box,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import SignIn from "./SignIn";
import Editor from "./Editor";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { format } from "date-fns";
import "./App.css";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: number;
  authorId: number;
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

const Admin: React.FC<Props> = (props: Props): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });

  const [openSignIn, setOpenSignIn] = useState<boolean>(false);
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost>();

  const navigate = useNavigate();

  const fetchPosts = async (settings: FetchSettings): Promise<void> => {
    try {
      const connection = await fetch(`/api/admin/${props.userId}`, settings);

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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${props.token}`,
      },
    };

    fetchPosts(settings);
  };
  const handleOpenSignIn = () => {
    if (openSignIn === false) {
      setOpenSignIn(true);
    }
  };
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };
  const handleOpenEditor = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setOpenEditor(true);
  };
  const handleCloseEditor = () => {
    setSelectedBlogPost(undefined);
    setOpenEditor(false);
    apiCall();
  };

  const handleSignOut = async () => {
    props.setToken("");
    props.setUserId(-1);
    props.setUsername("");
    navigate("/");
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
          {openEditor ? (
            <Button onClick={() => setOpenEditor(false)}>Takaisin</Button>
          ) : (
            <Button onClick={() => navigate("/")}>Etusivu</Button>
          )}
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
      {openEditor ? (
        <Editor
          selectedBlogPost={selectedBlogPost}
          handleCloseEditor={handleCloseEditor}
          userId={props.userId}
          username={props.username}
          token={props.token}
        />
      ) : (
        <Stack>
          <Typography variant="h5" textAlign="center">
            Omat postaukset
          </Typography>
          {Boolean(apiData.error === "Palvelimeen ei saada yhteyttä") ? (
            <Alert severity="info">{apiData.error}</Alert>
          ) : Boolean(apiData.error) ? (
            <Alert severity="error">{apiData.error}</Alert>
          ) : apiData.fetched ? (
            <List>
              {apiData.blogPosts.map((blogPost: BlogPost, idx: number) => {
                const timestamp = format(
                  new Date(blogPost.timestamp),
                  "dd.MM.yyyy' 'HH:mm"
                );
                const updatedAt = format(
                  new Date(blogPost.updatedAt),
                  "dd.MM.yyyy' 'HH:mm"
                );
                return (
                  <ListItem key={idx}>
                    <Card sx={{ width: "100%", padding: 5, mb: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{ mb: 2, fontWeight: "600" }}
                      >
                        {blogPost.header}
                      </Typography>
                      <Typography variant="subtitle2">
                        {timestamp}
                        {timestamp !== updatedAt
                          ? `  (Muokattu ${updatedAt})`
                          : null}
                      </Typography>
                      <Button
                        onClick={() => apiCall("PUT", "like", blogPost.id)}
                        disabled
                      >
                        <ThumbUpIcon fontSize="small" />
                        {` Hyvin sanottu (${blogPost.liked})`}
                      </Button>
                      <Button
                        onClick={() => apiCall("PUT", "dislike", blogPost.id)}
                        disabled
                      >
                        <ThumbDownIcon fontSize="small" />
                        {` En ole samaa mieltä (${blogPost.disliked})`}
                      </Button>
                      <Stack>
                        {blogPost.id ? (
                          <Button
                            variant="outlined"
                            onClick={() => handleOpenEditor(blogPost)}
                          >
                            Muokkaa
                          </Button>
                        ) : null}
                      </Stack>
                    </Card>
                  </ListItem>
                );
              })}
            </List>
          ) : null}{" "}
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenEditor(true)}
          >
            Luo uusi
          </Button>
        </Stack>
      )}
    </Container>
  );
};

export default Admin;
