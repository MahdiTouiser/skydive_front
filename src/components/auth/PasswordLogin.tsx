import { Button } from "flowbite-react";
import { FormEvent, useState } from "react";

interface PasswordLoginProps{
  onPasswordSubmit:()=>void;
  onReturn:()=>void
}

const  PasswordLogin : React.FC<PasswordLoginProps> =(props) =>{
  const [showPassword, setShowPassword] = useState<boolean>(false);
  function toggleShowPassword() {
    setShowPassword((showPassword) => !showPassword);
  }

  function onSubmit(event: FormEvent){
    event.preventDefault();
    props.onPasswordSubmit();
  }

  const showPasswordIcon: JSX.Element = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 mb-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const hidePasswordIcon: JSX.Element = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 mb-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );

  return (
    <section>
      <button onClick={props.onReturn} className="pt-8 pr-8 flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
        <span>بازگشت</span>
      </button>
      <form onSubmit={onSubmit} className="p-8 pt-4 border-b">
        <p className="mb-6 text-lg font-semibold">رمز عبور خود را وارد کنید.</p>
        <div className="flex w-full gap-1">
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              id="input-group-1"
              className="ltr text-lg placeholder:text-right w-full h-10 bg-gray-50 border border-gray-300 text-gray-900  rounded-sm focus:ring-blue-500 focus:border-blue-500 block pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-48"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0  flex items-center left-40 pr-3 "
            >
              {showPassword ? hidePasswordIcon : showPasswordIcon}
            </button>
            <div className="absolute left-0 h-10 top-0.5 py-1 pl-3 w-32">
              <div className="bg-gray-300 h-4/5 top-0.5 absolute -right-6 w-px"></div>
              <a>فراموش کردید؟</a>
            </div>
          </div>
          <div>
            <Button type="submit" color="success" className="rounded-sm">
              ورود
            </Button>
            {/* <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-sm text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">ورود</button> */}
          </div>
        </div>
      </form>
      <button className="flex items-center w-full h-full px-8 py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 ml-2"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
            clipRule="evenodd"
          />
        </svg>
        <p>ارسال کد یک بار مصرف از طریق پیامک</p>
      </button>
    </section>
  );
}

export default PasswordLogin