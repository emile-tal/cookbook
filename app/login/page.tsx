import LoginForm from "../ui/login/login-form"

export default function LoginPage() {
    return (
        <div className="flex justify-center bg-background pt-8 sm:pt-12 md:pt-24 px-8">
            <div className="space-y-8 bg-white p-4 sm:p-8 rounded-xl shadow-md max-w-[22.5rem]">
                <LoginForm />
            </div>
        </div>
    )
}