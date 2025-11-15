flowchart TD
  StartApp[App Launch] --> LoginPage[Show Login Page]
  LoginPage -->|Credentials entered| AuthCheck{Valid Credentials}
  AuthCheck -->|Yes| Dashboard[Show User Dashboard]
  AuthCheck -->|No| LoginPage

  Dashboard -->|Select Challenge| ChallengePage[Challenge Page]
  ChallengePage --> CodeEditor[Enter Code]
  CodeEditor --> SubmitBtn[Click Submit]
  SubmitBtn --> ApiRequest[Send Submission to API]
  ApiRequest --> ExecutionResult{Execution Result}
  ExecutionResult -->|Pass| ShowSuccess[Show Success Message]
  ExecutionResult -->|Fail| ShowError[Show Error Message]
  ShowSuccess --> UpdateLeaderboard[Update Leaderboard]
  ShowError --> CodeEditor

  Dashboard -->|View Profile| ProfilePage[User Profile]
  Dashboard -->|Admin Login| AdminLoginPage[Show Admin Login]
  AdminLoginPage -->|Credentials entered| AdminAuth{Admin Valid}
  AdminAuth -->|Yes| AdminPanel[Show Admin Panel]
  AdminAuth -->|No| AdminLoginPage
  AdminPanel --> ManageQuestions[Create Edit Questions]
  ManageQuestions --> AdminPanel