// interface MyButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   inputBox: number;
// }

// export function Button(props: MyButtonProps) {
//   const { ...rest } = props;
//   const defaultButtonClassNames = ` cursor-pointer flex flex-none items-center justify-center underline-offset-4 hover:underline `;

//   return (
//     <React.Fragment>
//       <input
//         {...rest}
//         className={` ` + rest.className ? defaultButtonClassNames + rest.className : defaultButtonClassNames}
//       />
//     </React.Fragment>
//   );
// }

import {
  type ChangeEventHandler,
  type CSSProperties,
  forwardRef,
  type HTMLProps,
  useCallback,
  useEffect,
  useState,
} from "react";

type Props = Omit<HTMLProps<HTMLTextAreaElement>, "aria-multiline" | "rows"> & {
  containerClassName?: string;
  containerStyle?: Omit<CSSProperties, "display">;
  blurOnLineBreak?: boolean;
  onReturn?: ChangeEventHandler<HTMLTextAreaElement>;
  suffix?: string;
  suffixClassName?: string;
  suffixStyle?: CSSProperties;
  readOnly?: boolean;
  overlapTechnique?: "grid" | "absolute";
};

const LineWrappingInput = forwardRef<HTMLTextAreaElement, Props>(function LineWrappingInputRef(
  {
    containerClassName,
    containerStyle = {},
    suffix = " ",
    suffixClassName,
    suffixStyle,
    blurOnLineBreak,
    onReturn,
    readOnly,
    overlapTechnique = "grid",
    ...props
  },
  ref,
) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const newValue = event.target.value.replace(/\r|\n/g, "");
      // Override user typing line breaks. Doesn't fire if the line break was pasted, that's handled by the else block.
      if ((event.nativeEvent as InputEvent).inputType === "insertLineBreak") {
        if (blurOnLineBreak) {
          event.target.blur();
        }
        onReturn?.({
          ...event,
          target: {
            ...event.target,
            value: newValue,
          },
        });
      } else {
        // Strip line breaks (from pasted text or any other reason)
        props.onChange?.({
          ...event,
          target: {
            ...event.target,
            // value: newValue,
          },
        });
        setValue(newValue);
      }
    },
    [blurOnLineBreak, onReturn, props],
  );
  return (
    <div
      className={`line-wrapping-input-container ${containerClassName ?? ""} mt-1 p-0.5`}
      style={{
        ...containerStyle,
        overflow: "auto",
        ...(overlapTechnique === "grid" ? { display: "grid" } : { position: "relative" }),
      }}
    >
      {!readOnly && (
        <textarea
          {...props}
          className={`line-wrapping-input ${props.className ?? ""} px-4 py-2 w-full flex-1 rounded bg-transition-color-8 hover:bg-transparent outline-0 hover:outline-2 outline-brand-color-1st focus:outline-2 focus-within:bg-transparent`}
          value={value}
          aria-multiline="false"
          style={{
            ...(props.style ?? {}),
            ...(overlapTechnique === "grid"
              ? {
                  gridArea: "1 / 1 / 2 / 2",
                }
              : { inset: 0, position: "absolute" }),
            minWidth: 0,
            overflow: "clip",
            overflowWrap: "break-word",
            resize: "none",
            whiteSpace: "pre-wrap",
          }}
          onChange={handleChange}
          rows={1}
          ref={ref}
        />
      )}
      <div
        className={`line-wrapping-input ${props.className ?? ""} px-4 py-2 w-full flex-1 rounded`}
        style={{
          ...(props.style ?? {}),
          ...(overlapTechnique === "grid"
            ? {
                gridArea: "1 / 1 / 2 / 2",
              }
            : {}),
          overflow: "clip",
          overflowWrap: "break-word",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
        }}
      >
        <span aria-hidden={!readOnly} style={{ visibility: readOnly ? "visible" : "hidden" }}>
          {value ?? props.placeholder}
        </span>
        <span className={`line-wrapping-input-suffix ${suffixClassName ?? ""}`} style={suffixStyle}>
          {suffix}
        </span>
      </div>
    </div>
  );
});

export default LineWrappingInput;
