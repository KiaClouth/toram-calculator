"use client";
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
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
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
    suffix = "",
    suffixClassName,
    suffixStyle,
    blurOnLineBreak,
    onReturn,
    onChange,
    readOnly,
    overlapTechnique = "grid",
    ...props
  },
  ref,
) {
  const [value, setValue] = useState(props.value ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedOrHovered, setIsFocusedOrHovered] = useState(false);
  useEffect(() => {
    setValue(props.value ?? "");
  }, [props.value]);

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
        onChange({
          ...event,
          target: {
            ...event.target,
            value: newValue,
          },
        });
        setValue(newValue);
      }
    },
    [blurOnLineBreak, onChange, onReturn],
  );

  return (
    <div
      className={`line-wrapping-input-container ${containerClassName ?? ""} mt-1 overflow-visible rounded ${readOnly ? " outline outline-transition-color-20" : ""}  ${isFocusedOrHovered ? "outline-brand-color-1st" : ""}`}
      style={{
        ...containerStyle,
        overflow: "auto",
        ...(overlapTechnique === "grid" ? { display: "grid" } : { position: "relative" }),
      }}
    >
      
      <textarea
          {...props}
          className={`line-wrapping-input ${props.className ?? ""} ${readOnly ? "hidden" : ""} w-full flex-1 rounded bg-transition-color-8 px-4 py-2 outline-1 outline-transparent focus-within:bg-transparent focus-within:outline-brand-color-1st hover:bg-transparent hover:outline-brand-color-1st`}
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
          onFocus={() => {
            setIsFocused(true);
            setIsFocusedOrHovered(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsFocusedOrHovered(false);
          }}
          onMouseEnter={() => {
            setIsFocusedOrHovered(true);
          }}
          onMouseLeave={() => {
            setIsFocusedOrHovered(isFocused ? true : false);
          }}
          rows={1}
          ref={ref}
        />
      <div
        className={`line-wrapping-input ${props.className ?? ""} w-full flex-1 rounded px-4 py-2 `}
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
