import { createSlice } from "@reduxjs/toolkit";
import { client } from "../../utils/client";
// import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

export const RESET_STORE = "RESET_STORE";
export const resetStore = () => ({
  type: RESET_STORE,
});

export const counterSlice = createSlice({
  name: "authorization",
  initialState: {
    isAddVolunteers: false,
    redirectTo: null,
    redirectToLogin: null,
    role: "",
    token: null,
    forgotPassword: null,
    isSignUp: false,
    signUpPopup: false,
    signUpMessage: "",
    loginData: "",
    errorMessage: null,
    successMessage: null,
  },
  reducers: {
    updateIsAddVolunteers: (state, action) => {
      state.isAddVolunteers = action.payload;
    },
    updateRedirectTo: (state, action) => {
      state.redirectTo = action.payload;
    },
    updateRole: (state, action) => {
      state.role = action.payload;
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    updateForgotPassword: (state, action) => {
      state.forgotPassword = action.payload;
    },
    updateSignUpClick: (state, action) => {
      state.isSignUp = action.payload;
    },
    updateSignUpMessage: (state, action) => {
      state.signUpMessage = action.payload;
    },
    updateSignUpPopup: (state, action) => {
      state.signUpPopup = action.payload;
    },
    updateLogiData: (state, action) => {
      state.loginData = action.payload;
    },
    updateErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    updateSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    updateRedirectToLogin: (state, action) => {
      state.redirectToLogin = action.payload;
    },
    updateResetMessage: (state, action) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  updateRedirectTo,
  updateRole,
  updateToken,
  updateForgotPassword,
  updateSignUpClick,
  updateSignUpMessage,
  updateSignUpPopup,
  updateLogiData,
  updateErrorMessage,
  updateRedirectToLogin,
  updateSuccessMessage,
  updateResetMessage,
} = counterSlice.actions;

export default counterSlice.reducer;

export const incrementAsync = (amount) => (dispatch) => {
  dispatch(incrementByAmount(amount));
};

export const userLogin = (userData) => async (dispatch, getState) => {
  try {
    const response = await client.post(
      "/login",
      {
        user_email: userData?.email,
        password: userData?.password,
        role: userData?.role,
      },
      { includeAuthorization: false }
    );

    console.log("API Response:", response);

    const { data } = response;

    if (data?.statusCode === 200) {
      const token = data?.token;
      if (!token) {
        throw new Error("Token is missing from the response.");
      }

      // console.log("Received Token:", token);

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        throw new Error("Invalid token format.");
      }

      const role = decodedToken?.role;
      const user_id = decodedToken?.user_id;
      const user_name = decodedToken?.user_name;
      console.log("Role:", role);

      if (!role) {
        throw new Error("Role is not found in token.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user_id);
      localStorage.setItem("user_name", user_name);

      // toast.success(data?.message);

      dispatch(updateLogiData(data));
      await dispatch(updateRole(role));

      const redirectPath =
        role !== "Creator"
          ? role === "Admin" || role === "Super Admin"
            ? "/receiverlayout/dashboard"
            : "/receiverlayout/todaydeadline"
          : "/layout/createbrief";
      console.log("Redirecting to:", redirectPath);
      return dispatch(updateRedirectTo(redirectPath));
    } else {
      // toast.error(data?.message || "Login failed.");
      dispatch(updateErrorMessage(data?.message));
    }
  } catch (error) {
    console.error("Login error:", error.message);
    // toast.error("An error occurred during login.");
  }
};

export const userSignUp = (userData) => async (dispatch, getState) => {
  try {
    const { data } = await client.post("/register", {
      password: userData.password,
      user_firstname: userData.firstName,
      user_lastname: userData.lastName,
      user_email: userData.email,
      role: userData.role,
      department: userData.department,
    });
    if (data?.statusCode === 201) {
      dispatch(updateSignUpPopup(true));
      dispatch(updateSignUpMessage(data?.message));
      dispatch(updateSuccessMessage(data?.statusCode));
    } else {
      dispatch(updateErrorMessage(data?.message));
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    // toast.error("An error occurred during sign-up.");
  }
};

export const forgotPassword =
  (userData, token) => async (dispatch, getState) => {
    let payload = {};
    console.log({ token });
    if (userData.newPassword && userData.confirmPassword) {
      payload = {
        action: "reset_password",
        new_password: userData?.newPassword,
        confirm_password: userData?.confirmPassword,
        // user_email: userData?.email,
        // role: userData?.role,
        reset_token: token,
      };
    } else if (userData.email && userData.role) {
      payload = {
        action: "validate_email",
        user_email: userData?.email,
        role: userData?.role,
      };
    }
    const { data } = await client.post("/forgot-password", payload, {
      includeAuthorization: false,
    });
    console.log(data?.statusCode);
    if (data?.statusCode === 200 && 201) {
      dispatch(updateSuccessMessage(data?.statusCode));
      dispatch(updateForgotPassword(false));
    } else {
      dispatch(updateErrorMessage(data?.error));
      console.log(data?.status);
    }
    // console.log(dispatch(updateSuccessMessage(data?.statusCode)))
  };

export const logoutUser = () => async (dispatch) => {
  localStorage.clear();
  await dispatch(updateRedirectTo("/"));
  // await alert("Logged out successfully!");
  // await location.reload();
};

// export const refreshToken = async () => {
//   try {
//     const { status, data } = await client.post("/login");

//     if (status) {
//       const token = data?.token;
//       localStorage.setItem("token", token);

//       //refreshUsers.forEach((callback) => callback(token));
//       // refreshUsers = [];

//       return token;
//     } else {
//       console.error("Refresh token request failed");
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//   }
// };

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("token");
    if (!refreshToken) {
      throw new Error("Refresh token is missing.");
    }

    const response = await client.post("/refresh", {
      refresh_token: refreshToken,
    });

    if (response.status === 200 && response.data?.token) {
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      return newToken;
    } else {
      throw new Error("Failed to refresh token.");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};

export const setupSessionTimeout = (dispatch, navigate) => {
  let timer;
  let sessionExpired = false;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (!sessionExpired) {
        sessionExpired = true;

        await localStorage.clear();
        alert("Session Expired");

        await dispatch(updateRedirectToLogin("/"));
        navigate("/");
      }
    }, 1 * 60 * 1000);
  };

  const handleUserActivity = () => {
    if (sessionExpired) return;
    resetTimer();
  };

  window.addEventListener("mousemove", handleUserActivity);
  window.addEventListener("keydown", handleUserActivity);

  resetTimer();

  return () => {
    window.removeEventListener("mousemove", handleUserActivity);
    window.removeEventListener("keydown", handleUserActivity);
    clearTimeout(timer);
  };
};
