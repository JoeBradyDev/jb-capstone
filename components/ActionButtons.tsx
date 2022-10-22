import { Button } from "./Button";

export interface IActionButton {
  content?: React.ReactNode;
  disabled?: boolean;
  inverted?: boolean;
  immediateAction?: boolean;
  onClick?: () => void;
  slowAction?: boolean;
}

export interface IActionButtonsProps {
  buttons: IActionButton[];
  className?: string;
}

export const ActionButtons: React.FC<IActionButtonsProps> = ({
  buttons,
  className,
}) => {
  return (
    <div className={`flex space-x-2 whitespace-nowrap ${className}`}>
      {buttons.map(
        ({ content, disabled, inverted, onClick: handleClick }, index, arr) => {
          const className = index > 0 && index + 1 < arr.length ? "mx-2" : "";

          return (
            <Button
              className={className}
              disabled={disabled}
              inverted={inverted}
              key={index}
              onClick={handleClick}
            >
              {content}
            </Button>
          );
        }
      )}
    </div>
  );
};
