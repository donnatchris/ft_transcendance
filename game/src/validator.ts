import z from "zod";

export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new Error(JSON.stringify(result.error.format()));
	}
	return result.data;
}
