import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center 
                        bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] 
                        dark:from-[#3a0ca3] dark:to-[#4361ee] 
                        text-gray-900 dark:text-white">
            <Loader2 className="animate-spin h-12 w-12 mb-4" />
            <p className="text-lg font-semibold animate-pulse">Please Wait...</p>
        </div>
    );
};

export default Loading;
