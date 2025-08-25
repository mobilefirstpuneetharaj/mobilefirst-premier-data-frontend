import { useNavigate } from "react-router-dom";
import warningImg from "../assets/page-not-found-warning-cones.png"; // your 404 cones image

export default function PageNotFound({ message }: { message?: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <img src={warningImg} alt="Page Not Found" className="w-40 mb-6" />
      <h1 className="text-4xl font-bold text-blue-700">404</h1>
      <p className="text-lg text-gray-600 mt-2">
        {message || "Oops! Page not found."}
      </p>
      <p className="text-gray-500 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
}
