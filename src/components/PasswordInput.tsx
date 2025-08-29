import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react"; // or use react-icons/fa
import { preventSpace } from "../utils/inputHandlers";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  maxLength?: number;
}

export default function PasswordInput({ name, placeholder, maxLength = 50 }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={preventSpace}
        className="w-full p-3 border rounded pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}
