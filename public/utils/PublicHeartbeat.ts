type TimerId = ReturnType<typeof setInterval> | null;
type HeartbeatOptions = {
	intervalMs?: number;
	url?: string;
	debug?: boolean;
};


export class PublicHeartbeat {

	private intervalMs: number;
	private url: string;
	private debug: boolean = false;
	private timer: TimerId | null = null;

	constructor(options: HeartbeatOptions = {}) {
		this.intervalMs = options.intervalMs ?? 10000;
		this.url = options.url ?? '/gate/user/heartbeat';
		this.debug = options.debug ?? false;
		if (this.debug)
			console.log("[Public: heartbeat] Heartbeat initialized with options:", options);
	}

	public start() {
		if (this.timer !== null)
			return;
		this.timer = setInterval(() => this.sendHeartbeat(), this.intervalMs);
		if (this.debug)
			console.log("[Public: heartbeat] Starting heartbeat with interval:", this.intervalMs);
	}

	public stop() {
		if (this.timer === null)
			return;
		clearInterval(this.timer);
		this.timer = null;
		if (this.debug)
			console.log("[Public: heartbeat] stopped.");
	}

	private async sendHeartbeat() {
		if (this.debug)
			console.log("[Public: heartbeat] sending...");
		try {
			const res = await fetch(this.url, {
				method: 'GET',
				credentials: 'include'
			});
			if (!res.ok) {
				if (this.debug)
					console.warn("[Public: heartbeat] non-2xx response:", res.status, res.statusText);
				if (res.status === 401 || res.status === 403) {
					if (this.debug)
						console.warn("[Public: heartbeat] Unauthorized, stopping heartbeat.");
					this.stop();
					return;
				}
			}
			else if (this.debug)
				console.log("[Public: heartbeat] ok.");
		}
		catch (error) {
			if (this.debug)
				console.error("[Public: heartbeat] error:", error);
		}
	}
}
