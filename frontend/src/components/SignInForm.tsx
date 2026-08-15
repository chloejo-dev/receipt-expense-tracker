import "./SignInForm.css";

export default function SignInForm() {
  return (
    <form className='sign-in-form'>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          required
          autoComplete='email'
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          required
          autoComplete='current-password'
        />
      </div>
      <button type='submit' className='sign-in-btn'>
        Sign in
      </button>
    </form>
  );
}
