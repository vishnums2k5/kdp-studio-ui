import { sceneArt } from "@/mocks/art";

/** Resolve mock scene-art srcs ("mock:art:<n>" / "mock:gen:<n>") into
 * data URIs at render time (the store seeds lazily-drawn placeholders). */
export function resolveSrc(src: string): string {
  if (src.startsWith("mock:art:")) {
    return sceneArt(Number(src.slice("mock:art:".length)) || 1);
  }
  if (src.startsWith("mock:gen:")) {
    return sceneArt(500 + (Number(src.slice("mock:gen:".length)) || 1));
  }
  return src;
}
