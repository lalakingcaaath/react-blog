type CancelButtonProps = {
  onClick: () => void;
};

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-ghost hover:bg-base-200`}>
      Cancel
    </button>
  );
}
