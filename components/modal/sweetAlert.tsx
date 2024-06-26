// components/Alert.tsx
import Swal from "sweetalert2";
import { FC } from "react";

interface AlertProps {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";
  confirmButtonText: string;
  menu: string;
}

const Alert: FC<AlertProps> = ({
  title,
  text,
  icon,
  confirmButtonText,
  menu,
}) => {
  const showAlert = () => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
  };

  return (
    <button
      onClick={showAlert}
      style={{
        padding: "10px 20px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Oke
    </button>
  );
};

export default Alert;
