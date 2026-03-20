import { useState } from "react";
import SignInForm from "./SignInForm";

const Auth = () => {
  const [authForm, setAuthForm] = useState(false);

  const showAuthFormHandler = () => {
    setAuthForm((prevState) => !prevState);
  };

  return !authForm ? <SignInForm onCreateAccountButton={showAuthFormHandler} /> : <>SignUpForm</>;
};

export default Auth;
