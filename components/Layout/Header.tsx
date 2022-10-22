import { AiFillCar as CarIcon } from "react-icons/ai";
import { useSession } from "../../utils/SessionProvider.client";

export interface IHeaderProps {}

export const Header: React.FC<IHeaderProps> = () => {
  const { logout } = useSession();

  return (
    <div className="fixed inset-0 w-full h-20 bg-gradient-to-r from-indigo-800 via-violet-500 to-violet-300 z-30 shadow-md">
      <div className="flex flex-col w-full h-full z-20">
        <div className="p-px bg-gradient-to-r from-violet-800 via-violet-500 to-violet-400" />
        <div className="flex justify-between items-center w-full h-full">
          <div className="flex items-center text-xl text-indigo-50 font-medium py-2 px-4 drop-shadow">
            <CarIcon className="mr-3 h-12 w-12" />
            Car Sales Price Prediction Engine
          </div>
          <div className="py-2 px-6 h-full flex items-center">
            <button
              className="text-white drop-shadow text-lg font-medium hover:underline pointer"
              onClick={() => logout && logout()}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="p-1 bg-gradient-to-r from-indigo-800 via-violet-600 to-violet-400" />
      </div>
    </div>
  );
};
