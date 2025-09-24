import fp from "fastify-plugin";
import z from "zod";

export const SECRET_KEY = process.env.JWT_SECRET_KEY ?? "";

export const JwtSchema = z.object({
	id_user: z.number(),
	login: z.string(),
	display_name: z.string(),
	avatar: z.string(),
	status: z.string(),
});

export default fp(async (app) => {
	app.decorateRequest("token", null);

	app.addHook("preHandler", async (request, reply) => {
		try {
			const rawPayload = await request.jwtVerify();
			const parsed = JwtSchema.parse(rawPayload);

			request.token = parsed;
		} catch (err) {
			request.token = null;
		}
	});
});

declare module "fastify" {
	interface FastifyRequest {
		token: z.infer<typeof JwtSchema> | null;
	}
}
