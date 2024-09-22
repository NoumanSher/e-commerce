export const CustomDot = ({ onClick, index, active }: any) => {
  return (
    <button
      className={`mx-1 w-3 h-3 rounded-full ${
        active ? "bg-white" : "bg-[#333333]"
      }`}
      onClick={onClick}
    >
    </button>
  );
};
