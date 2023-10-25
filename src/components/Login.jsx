import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <section>
      <div class="container">
        <form action="#" method="post">
          <h2>login</h2>

          <div class="inputfield">
            <input type="text" required="required" />
            <span>Username</span>
            <i></i>
          </div>
          <div class="inputfield">
            <input type="password" required="required" />
            <span>Password</span>
            <i></i>
          </div>

          <button type="submit">Log in</button>
          
          <div class="alt">
            <div className="text">Or Sign in with:</div>
            <button type="button">MetaMask</button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Login;
