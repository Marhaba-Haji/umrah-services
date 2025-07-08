import * as React from "react";

export const KaabaIcon = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => (
  <img
    ref={ref}
    src="https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//kaaba%20color%20icon.png"
    alt="Kaaba Icon"
    width={36}
    height={36}
    style={{ display: "inline-block", verticalAlign: "middle", ...props.style }}
    {...props}
  />
));
KaabaIcon.displayName = "KaabaIcon";
