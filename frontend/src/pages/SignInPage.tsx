import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  return (
    <div className='flex flex-col'>
      <h1 className='text-center text-2xl leading-8 p-4 font-heading'>
        Track your spending effortlessly.
      </h1>
      <SignInForm />
      <p>
        Don't have an account? <a href='/sign-up'>Sign up</a>
      </p>
    </div>
  );
}
