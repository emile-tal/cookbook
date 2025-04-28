import LoginForm from "../ui/login/login-form"

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-2 md:p-8 rounded-xl shadow-md w-[12.5rem] sm:w-[22.5rem]">
                <LoginForm />
            </div>
        </div>
    )
}