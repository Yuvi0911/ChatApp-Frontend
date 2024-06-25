import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";


const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev)

  //useInputValidation, useStrongPassword, etc 6pp package me functions h jinki help se hum apne username, passsword ko validate kr skte h conditions k basics pr. Ye condition kuch bhi ho skti h jaise ki username me space use nhi kr skte, password me min 8 words hone chaiye etc.

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  //yadi mujhe strong password vala error show nhi krna toh m ye line use kr skta hu
  //const password = useInputValidation();

  const avatar = useFileHandler("single")

  const dispatch = useDispatch();
  // axios.defaults.withCredentials = true;
  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...")

    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      }
    }

try {
  //axios ki help se hum client side se server side pr data bhej skte h aur server side se client side pr data le skte h. Ye hhtp request ko manage karne k liye use hoti h.
  const { data } = await axios.post(
    `${server}/api/v1/user/login`,
    {
      username: username.value,
      password: password.value
    },
    config
  );

  dispatch(userExists(data.user));

  toast.success(data.message,{
    id: toastId,
  });

} catch (error) {
  //yadi error aa jata h toh backend me humne jo respone me message me jo error set kiya hua h vo dikha dege.
  toast.error(error?.response?.data?.message || "Something went wrong",{
    id: toastId,
  });
}
finally{
  setIsLoading(false);
}

  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...")


    setIsLoading(true);

    //jab bhi user signup krega toh uska data cloudinary me store krege

    //fromData me signup form ka data store krege aur server pr is form ko bheje ge.
    const formData = new FormData();

    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    try {
      const {data} = await axios.post(`${server}/api/v1/user/new`, formData, config);
      // console.log(data)

      dispatch(userExists(data.user));

      toast.success(data.message,{
        id: toastId,
      });

    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong",{
          id: toastId,
        }); 
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      backgroundImage: "linear-gradient(#79a0c1, #42668e)",
    }}>
      <Container component={"main"} maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {isLogin ? ( 
            <>
              <Typography variant="h5">Login</Typography>
              <form 
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
                
                >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                 sx={{
                  marginTop: "1rem",
                 }}
                 variant="contained" color="primary" type="submit"
                 fullWidth
                 disabled={isLoading}
                 >
                  LOGIN
                 </Button>

                 <Typography textAlign={"center"} m={"1rem"}>OR</Typography>

                 <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text" 
                  onClick={toggleLogin}
                 >
                  SIGN UP
                 </Button>

              </form>
            </>
            ) : (
              <>
              <Typography variant="h5">Sign Up</Typography>
              <form 
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
                >
                  <Stack 
                    position={"relative"} 
                    width={"10rem"}
                    margin={"auto"}>
                      <Avatar sx={{
                        width: "10rem",
                        height: "10rem",
                        objectFit: "contain",
                      }}
                      src={avatar.preview}
                       />
                     
                      <IconButton 
                        sx={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          color: "white",
                          bgcolor: "rgba(0,0,0,0.5)",
                          ":hover":{
                            bgcolor: "rgba(0,0,0,0.7)",
                          }
                        }}
                          component="label"
                        >
                        <>
                          <CameraAltIcon/>
                          <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}
                          />
                        </>
                      </IconButton>
                    </Stack>
                    {
                  //photo me kuch error hoga toh show krega ye code
                    avatar.error && (
                      <Typography m={"1rem auto"}
                      width={"fit-content"}
                      display={"block"}
                      color="error" variant="caption">
                        {avatar.error}
                      </Typography>
                    )
                  }
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {
                  //iski help se hum error show krege yadi username me kuch glti hogi toh, jo ki hum validators.js file me check krege
                  username.error && (
                    <Typography color="error" variant="caption">
                      {username.error}
                    </Typography>
                  )
                }
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {
                  //strong password nhi hoga toh error show krega ye code
                    password.error && (
                      <Typography color="error" variant="caption">
                        {password.error}
                      </Typography>
                    )
                  }

                <Button
                 sx={{
                  marginTop: "1rem",
                 }}
                 variant="contained" color="primary" type="submit" 
                 fullWidth
                 disabled={isLoading}
                 >
                  SIGN UP
                 </Button>

                 <Typography textAlign={"center"} m={"1rem"}>OR</Typography>

                 <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text" 
                  onClick={toggleLogin}
                 >
                  LOGIN IN
                 </Button>

              </form>
            </>
            )}
          </Paper>
      </Container>
    </div>
  )
}

export default Login
