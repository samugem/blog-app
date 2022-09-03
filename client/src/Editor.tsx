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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import SignIn from "./SignIn";
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import "./App.css";
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

const Admin: React.FC = (): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>();
  const [username, setUsername] = useState<string>(
    String(localStorage.getItem("username"))
  );
  const [token, setToken] = useState<string>(
    String(localStorage.getItem("token"))
  );
  const navigate = useNavigate();

  const fetchPosts = async (settings: FetchSettings): Promise<void> => {
    try {
      const connection = await fetch(`/api/admin`, settings);

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
  const addNewComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.content.value) {
      const connection = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          header: formRef.current?.content.value,
          content: formRef.current?.content.value,
        }),
      });

      if (connection.status === 200) {
        apiCall();
      }
    }
  };

  const apiCall = async (
    method?: string,
    likedislike?: string,
    id?: number
  ): Promise<void> => {
    let settings: FetchSettings = {
      method: method || "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    settings = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
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

  const handleSignOut = async () => {
    setToken("");
    localStorage.setItem("token", "");
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
        setToken={setToken}
        setUsername={setUsername}
        setOpenSignIn={setOpenSignIn}
      />

      {token ? (
        <Box
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => navigate("/")}>Etusivu</Button>
          <Button onClick={() => handleSignOut()}>Kirjaudu ulos</Button>{" "}
          <Typography variant="h5">{username}</Typography>
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
      <Box component="form" onSubmit={addNewComment} ref={formRef}>
        <Stack spacing={1}>
          <TextField id="content" multiline rows={2} required></TextField>
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Tallenna kirjoitus
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Admin;
