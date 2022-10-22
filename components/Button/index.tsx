import { SHARED_CLASSES, CLASS_MAPPING } from "./styles";

export interface IButtonProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  inverted?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({
  children,
  className: parentClasses,
  disabled,
  inverted = false,
  onClick: handleClick,
}) => {
  const classes = inverted ? CLASS_MAPPING.inverted : CLASS_MAPPING.default;

  const className = [
    SHARED_CLASSES ?? "",
    classes?.standard ?? "",
    disabled ? classes?.disabled ?? "" : classes.enabled ?? "",
    parentClasses ?? "",
  ].join(" ");

  return (
    <button disabled={disabled} className={className} onClick={handleClick}>
      {children ?? "Submit"}
    </button>
  );
};
