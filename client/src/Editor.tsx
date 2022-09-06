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
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
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
  published: boolean;
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
  username: string;
  userId: number;
  selectedBlogPost: any;
  handleCloseEditor: any;
}

const Editor: React.FC<Props> = (props: Props): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    blogPosts: [],
    error: "",
    fetched: false,
  });
  const formRef = useRef<HTMLFormElement>();
  const [header, setHeader] = useState<string>(
    props.selectedBlogPost?.header || ""
  );
  const [imgUrl, setImgUrl] = useState<string>(
    props.selectedBlogPost?.imgUrl || ""
  );
  const [id, setId] = useState<number>(props.selectedBlogPost?.id);
  const [published, setPublished] = useState<boolean>(
    props.selectedBlogPost?.published || false
  );
  const [content, setContent] = useState<string>(
    props.selectedBlogPost?.content || ""
  );

  const [errorMsg, setErrorMsg] = useState<string>("");

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
      ["clean"],
    ],

    clipboard: {
      matchVisual: false,
    },
  };

  const addNewBlogPost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.content.value) {
      const connection = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          authorId: props.userId,
          header: header,
          content: content,
          published: published,
        }),
      });

      if (connection.status === 200) {
        props.handleCloseEditor();
      } else if (connection.status === 413) {
        setErrorMsg("Liite on liian suuri");
      }
    }
  };
  const editBlogPost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.content.value) {
      const connection = await fetch(`/api/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          authorId: props.userId,
          header: header,
          content: content,
          published,
        }),
      });

      if (connection.status === 200) {
        props.handleCloseEditor();
      } else if (connection.status === 413) {
        setErrorMsg("Liite on liian suuri");
      }
    }
  };
  const deleteBlogPost = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.content.value) {
      const connection = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${props.token}`,
        },
      });

      if (connection.status === 200) {
        props.handleCloseEditor();
      }
    }
  };
  const formHandler = (e: React.FormEvent) => {
    if (props.selectedBlogPost) {
      editBlogPost(e);
    } else {
      addNewBlogPost(e);
    }
  };
  const handlePublished = () => {
    setPublished(!published);
  };

  return (
    <Container sx={{ height: "100vh" }}>
      {props.token ? (
        <>
          <Box component="form" onSubmit={formHandler} ref={formRef}>
            {Boolean(errorMsg) ? (
              <Alert severity="error">{errorMsg}</Alert>
            ) : null}
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
                  onClick={deleteBlogPost}
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
