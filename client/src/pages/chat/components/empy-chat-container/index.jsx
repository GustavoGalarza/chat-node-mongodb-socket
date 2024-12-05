import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";


const EmpyChatContainer = () => {
    return (
        <div className="flex-1 md:bg-[#1c2041] md:flex flex-col justify-center items-center hidden duration-100 transition-all" >
            <Lottie 
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}
            />  
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center " >
                <h3 className="poppins-semibold-italic" >
                    Hi<span className="text-blue-600" >!</span> Bienvenido al 
                    <span className="text-blue-600"> Chat-APP</span> en tiempo real
                    <span className="text-blue-600">☺☻</span>
                </h3>
            </div>
        </div>
    );
};

export default EmpyChatContainer;