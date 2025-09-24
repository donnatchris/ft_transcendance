export * from "./game";
export * from "./messages/base";
export * from "./messages/server";
export * from "./messages/client";

export interface Tournament {
	id: number;
	name: string;
	status: string;
	created_by: number;
	created_at?: string;
}
