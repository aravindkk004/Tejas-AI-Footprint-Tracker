import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <SignUp fallbackRedirectUrl={"/get-details"}/>
    </div>
  );
}
