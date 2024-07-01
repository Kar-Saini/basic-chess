import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-around items-center bg-slate-950 h-screen">
      <div>
        <img
          src="/image.png"
          alt=""
          className="max-w-2xl rounded-lg shadow-md"
        />
      </div>
      <div>
        <button
          className="text-5xl font-bold text-white bg-slate-600 px-6 py-4 text-center flex items-center justify-center rounded-lg hover:bg-slate-800 "
          onClick={() => {
            navigate("/room");
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default Landing;
