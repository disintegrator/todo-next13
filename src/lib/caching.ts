import { revalidateTag as nextRevalidateTag, revalidateTag } from "next/cache";

export const cacheTags = {
	todos: () => `todos`,
	todo: (id: number) => `todos:${id}`,
} as const;

type TagMap = typeof cacheTags;
type RevalidateMap = {
	[Tag in keyof TagMap]: (...args: Parameters<TagMap[Tag]>) => void;
};

export const revalidate: RevalidateMap = {
	todos: () => revalidateTag(cacheTags.todos()),
	todo: (id: number) => revalidateTag(cacheTags.todo(id)),
};
