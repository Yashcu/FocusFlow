export function formatDuration(seconds: number, style: "short" | "long" = "short"): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (style === "long") {
        let result = [];
        if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
        if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
        if (result.length === 0) return "0 minutes";
        return result.join(" ");
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m`;
    }
    return `0m`;
}
