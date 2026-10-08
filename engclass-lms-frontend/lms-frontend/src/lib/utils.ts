export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(amount: number): string {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} menit`;
  return `${h} jam ${m} menit`;
}

export function initials(name: string | null | undefined): string {
  return (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function youtubeEmbedUrl(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  const input = value.trim();
  const videoIdPattern = /^[\w-]{11}$/;
  if (videoIdPattern.test(input)) return `https://www.youtube.com/embed/${input}`;
  try {
    const url = new URL(input);
    let videoId = "";
    if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (url.hostname.includes("youtube.com") || url.hostname.includes("youtube-nocookie.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (url.pathname === "/watch") videoId = url.searchParams.get("v") ?? "";
      else if (["embed", "shorts", "live"].includes(parts[0] ?? "")) videoId = parts[1] ?? "";
    }
    return videoIdPattern.test(videoId) ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}

export function normalizeYoutubeUrl(value: string): string {
  const videoId = youtubeEmbedUrl(value).split("/").pop();
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : value.trim();
}
