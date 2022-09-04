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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const Editor = ({ selectedBlogPost }: any): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });
  const formRef = useRef<HTMLFormElement>();
  const [token, setToken] = useState<string>(
    String(localStorage.getItem("token"))
  );
  const [header, setHeader] = useState<string>(selectedBlogPost.header || "");
  const [published, setPublished] = useState<boolean>(
    selectedBlogPost.published || false
  );
  const [content, setContent] = useState<string>(
    selectedBlogPost.content || ""
  );
  const navigate = useNavigate();
  const modules = {
    toolbar: [
      [{ "header": "1" }, { "header": "2" }, { "font": [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { "list": "ordered" },
        { "list": "bullet" },
        { "indent": "-1" },
        { "indent": "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const addNewBlogPost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.content.value) {
      const connection = await fetch("/api/blogpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: formRef.current?.content.value,
          header: formRef.current?.content.value,
          content: formRef.current?.content.value,
        }),
      });

      if (connection.status === 200) {
        navigate("/admin");
      }
    }
  };

  const handleDelete = () => {
    console.log(`${selectedBlogPost.id} poistettu`);
  };

  const handlePublished = () => {
    setPublished(!published);
  };

  useEffect(() => {
    console.log(selectedBlogPost);
  }, [selectedBlogPost]);

  return (
    <Container sx={{ height: "100vh" }}>
      {token ? (
        <>
          <Box component="form" onSubmit={addNewBlogPost} ref={formRef}>
            <Stack spacing={1}>
              <TextField
                id="content"
                label="Otsikko"
                required
                value={header}
                onChange={(newValue) => setHeader(newValue.target.value)}
                rows={1}
              />
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={published}
                        onChange={handlePublished}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    }
                    label="Julkaise"
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="error"
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={handleDelete}
                >
                  Poista
                </Button>
              </Box>
              <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                Tallenna
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button fullWidth variant="outlined" onClick={() => navigate("/")}>
            Etusivulle
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Editor;
