import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthInitializer } from "./components/AuthInitializer";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { ChatPage } from "./pages/Chat";
import { AccountPage } from "./pages/Account";
import { ConversationPage } from "./pages/Chat/Conversation";
import { NewConversationPage } from "./pages/Chat/NewConversation";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AuthInitializer />}>
        <Route path="/" element={<ChatPage />}>
          <Route path="chat" element={<NewConversationPage />}>
            <Route path=":id" element={<ConversationPage />} />
          </Route>
        </Route>
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
    </Routes>
  </BrowserRouter>,
);
