import Image, { type ImageProps } from "next/image";
import { isSvg } from "@/lib/utils";

/** next/image com suporte a SVG locais (servidos sem otimização). */
export function SmartImage({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image alt={alt} {...props} unoptimized={props.unoptimized ?? isSvg(src)} />;
}
