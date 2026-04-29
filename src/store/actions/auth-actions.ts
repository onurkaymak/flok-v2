import axios from "axios";
import type { AppDispatch } from "../index";
import { userActions } from "../slices/user-slice";
import { uiActions } from "../slices/ui-slice";

import { logoutTimer } from "../../App";

import type { User, SignInUserInfo, CreateUserInfo } from "../../types";

export const createUser = ({ enteredName, enteredEmail, enteredPassword, selectedRole }: CreateUserInfo) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.post("http://localhost:5000/accounts/register", {
        userName: enteredName,
        email: enteredEmail,
        password: enteredPassword,
        employeeRole: selectedRole,
      });

      await dispatch(signInUser({ enteredEmail, enteredPassword }));
    } catch (err) {
      dispatch(
        uiActions.showNotification({
          title: "Registration Error",
          message: "Unable to create account. Please try again.",
        }),
      );
    }
  };
};

export const signInUser = ({ enteredEmail, enteredPassword }: SignInUserInfo) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post("http://localhost:5000/accounts/signIn", {
        email: enteredEmail,
        password: enteredPassword,
      });

      const userInfo: User = {
        name: response.data.userName,
        userId: response.data.userId,
        token: response.data.token,
        tokenExpTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString(),
        isLoggedIn: true,
        userRole: response.data.userRole,
      };

      localStorage.setItem("userData", JSON.stringify(userInfo));

      dispatch(userActions.login(userInfo));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          title: "Sign In Error",
          message: "Invalid email or password. Please try again.",
        }),
      );
    }
  };
};

export const logOutUser = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(userActions.logout());
    localStorage.removeItem("userData");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };
};
