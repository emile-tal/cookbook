import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function NoBooks({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <MenuBookIcon className="text-gray-300 scale-[200%] min-h-16 w-16" />
            <p className="text-gray-600 text-lg mt-4">{message}</p>
        </div>
    );
}