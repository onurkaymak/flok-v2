import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Auth = () => {
  const [authForm, setAuthForm] = useState(false);

  const showAuthFormHandler = () => {
    setAuthForm((prevState) => !prevState);
  };

  return !authForm ? (
    <SignInForm onCreateAccountButton={showAuthFormHandler} />
  ) : (
    <SignUpForm onCreateAccount={showAuthFormHandler} />
  );
};

export default Auth;
