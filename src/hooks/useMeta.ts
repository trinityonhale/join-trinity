import { useEffect } from "react";

export default function useMeta(meta: {
    title: string,
    description?: string
}) {
    useEffect(() => {
        document.title = `${meta.title} | Open Trinity`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description || meta.title);
    }, [meta])
}