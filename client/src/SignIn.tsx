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
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useState, useRef } from "react";

const SignIn = ({ handleClose, openSignIn, setToken, setOpenSignIn }: any) => {
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>();
  const [showPassword, setShowPassword] = useState(false);

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
          let { token, userId } = await connection.json();
          setToken(token);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", username);
          setOpenSignIn(false);
        } else {
          setErrorMsg("Väärä käyttäjätunnus tai salasana");
          localStorage.setItem("token", "");
          localStorage.setItem("username", "");
          localStorage.setItem("userId", "");
        }
      }
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Dialog onClose={() => handleClose()} open={openSignIn}>
      <Card sx={{ minWidth: 275 }}>
        <Box component="form" onSubmit={handleSignIn} ref={formRef}>
          <CardContent>
            <Stack spacing={2}>
              <Typography textAlign="center">Kirjaudu</Typography>
              <TextField id="username" label="Tunnus" required />
              <FormControl>
                <InputLabel htmlFor="password" required>
                  Salasana
                </InputLabel>
                <OutlinedInput
                  id="password"
                  label="password"
                  type={showPassword ? "text" : "password"}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
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
