type RemoveButtonProps = {
  onClick: () => void;
  label?: string; // Optional: in case you want to change the text later
};

export default function RemoveButton({
  onClick,
  label = "Remove image",
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-ghost btn-xs text-error hover:bg-error/10 mt-2`}
    >
      {label}
    </button>
  );
}
