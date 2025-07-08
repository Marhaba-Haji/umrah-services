import * as React from "react";

export const MasjidNabawiIcon = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => (
  <img
    ref={ref}
    src="https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//madinah%20icon.png"
    alt="Masjid Nabawi Icon"
    width={36}
    height={36}
    style={{ display: "inline-block", verticalAlign: "middle", ...props.style }}
    {...props}
  />
));
MasjidNabawiIcon.displayName = "MasjidNabawiIcon";
