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
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "./App.css";

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

const Main: React.FC = (): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });
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

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <Container>
      <Typography variant="h4" textAlign="center">
        Blogi
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button>Kirjaudu</Button>
      </Box>
      <Stack>
        {Boolean(apiData.error) ? (
          <Alert severity="error">{apiData.error}</Alert>
        ) : apiData.fetched ? (
          <List>
            {apiData.blogPosts.map((blogPosts: BlogPost, idx: number) => {
              return (
                <ListItem key={idx}>
                  <Card sx={{ width: "100%", padding: 5, mb: 2 }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "600" }}>
                      {blogPosts.header}
                    </Typography>
                    <Typography variant="subtitle2">
                      {format(
                        new Date(blogPosts.timestamp),
                        "dd.MM.yyyy' 'HH:mm"
                      )}
                      {blogPosts.updatedAt
                        ? `  (Muokattu ${format(
                            new Date(blogPosts.updatedAt),
                            "dd.MM.yyyy' 'HH:mm"
                          )})`
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
                      {<span>{blogPosts.content}</span>}
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