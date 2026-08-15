import SignInForm from "../components/SignInForm";
import "./SignInPage.css";

export default function SignInPage() {
  return (
    <div className='sign-in-page'>
      <header className="title">Expense Tracker</header>
      <main className='sign-in-main'>
        <h1 className='main-text'>Track your spending effortlessly.</h1>
        <SignInForm />
        <p>
          Don't have an account? <a href='/sign-up'>Sign up</a>
        </p>
      </main>
    </div>
  );
}
