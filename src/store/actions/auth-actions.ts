import axios from "axios";
import type { AppDispatch } from "../index";
import { userActions } from "../slices/user-slice";
import { uiActions } from "../slices/ui-slice";

import type { User } from "../../types";

interface UserInfo {
  enteredEmail: string;
  enteredPassword: string;
}

export const SignInUser = ({ enteredEmail, enteredPassword }: UserInfo) => {
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
      dispatch(userActions.setIsLoggedIn(true));
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
