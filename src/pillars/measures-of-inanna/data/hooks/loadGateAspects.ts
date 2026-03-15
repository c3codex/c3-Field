import matter from "gray-matter";

export type Aspect = {
  id: string;
  sign: string;
  title: string;
  text: string;
  side: "left" | "right";
  top: string;
};

export function parseGateAspects(raw: string): Aspect[] {
  const { content } = matter(raw);

  const items = content
    .split("\n- ")
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");

      const obj: Record<string, string> = {};

      lines.forEach((l) => {
        const [k, ...rest] = l.split(":");
        if (!k) return;
        obj[k.trim()] = rest.join(":").trim();
      });

      return {
        id: obj.id,
        sign: obj.sign,
        title: obj.title,
        text: obj.text,
        side: obj.side as "left" | "right",
        top: obj.top,
      };
    });

  return items;
}