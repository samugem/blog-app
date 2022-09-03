import {
  Typography,
  Stack,
  Button,
  Dialog,
  Card,
  CardActions,
  CardContent,
  Box,
  TextField,
  Alert,
} from "@mui/material";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({
  handleClose,
  openSignIn,
  setToken,
  setUsername,
  setOpenSignIn,
}: any) => {
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (formRef.current?.username.value) {
      const username = formRef.current?.username.value;
      if (formRef.current?.password.value) {
        const connection = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: formRef.current?.password.value,
          }),
        });

        if (connection.status === 200) {
          let { token } = await connection.json();
          setToken(token);
          setUsername(username);
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          setOpenSignIn(false);
        } else {
          setErrorMsg("Väärä käyttäjätunnus tai salasana");
          setToken("");
          setUsername("");
          localStorage.setItem("token", "");
          localStorage.setItem("username", "");
        }
      }
    }
  };

  return (
    <Dialog onClose={() => handleClose()} open={openSignIn}>
      <Card sx={{ minWidth: 275 }}>
        <Box component="form" onSubmit={handleSignIn} ref={formRef}>
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign="center">Kirjaudu</Typography>
              <TextField id="username" label="Tunnus" required />
              <TextField id="password" label="Salasana" required />
              {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
            </Stack>
            <CardActions>
              <Button type="submit" variant="contained">
                Kirjaudu sisään
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleClose()}
              >
                Peruuta
              </Button>
            </CardActions>
          </CardContent>
        </Box>
      </Card>
    </Dialog>
  );
};
export default SignIn;
