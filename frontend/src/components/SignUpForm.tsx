import "./SignUpForm.css";

export default function SignUpForm() {
  return (
    <form className='sign-up-form'>
      <div className='form-field'>
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' name='name' required autoComplete='name' />
      </div>
      <div className='form-field'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
          required
          autoComplete='email'
        />
      </div>
      <div className='form-field'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          required
          autoComplete='new-password'
        />
      </div>
      <div className='form-field'>
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          required
          autoComplete='new-password'
        />
      </div>
      <button type='submit' className='sign-up-btn'>
        Sign up
      </button>
    </form>
  );
}
