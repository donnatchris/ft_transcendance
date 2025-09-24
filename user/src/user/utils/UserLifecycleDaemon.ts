import { dbRun } from "./dbUtils.js";


type DaemonOptsType = {
  offlineDelaySec?: number;
  deathDelaySec?: number;
  offlineDaemonInterval?: number;
  purgeDaemonInterval?: number;
};


export class UserLifecycleDaemon {

	private readonly offlineDelaySec: number;
	private readonly deathDelaySec: number;
	private readonly offlineDaemonInterval: number;
	private readonly purgeDaemonInterval: number;
	private statusTimer?: NodeJS.Timeout;
	private purgeTimer?: NodeJS.Timeout;
	private started = false;

	constructor(opts: DaemonOptsType = {} ) {
		this.offlineDelaySec = opts.offlineDelaySec ?? 10;
		this.deathDelaySec = opts.deathDelaySec ?? 15768000;
		this.offlineDaemonInterval = opts.offlineDaemonInterval ?? 5000;
		this.purgeDaemonInterval = opts.purgeDaemonInterval ?? 86400 * 1000;
	}

	start() {
		if (this.started)
			return ;
		console.log("[User: UserLifecycleDaemon] Starting user lifecycle daemon...");
		this.started = true;

		this.statusTimer = setInterval(async () => {
			try {
				await dbRun(`
					UPDATE users
					SET status = 'offline'
					WHERE status != 'offline'
					AND (strftime('%s','now') - last_seen) > ?
				`, [this.offlineDelaySec]);
			} catch (error) {
				console.error('[User: UserLifecycleDaemon] Failed to set offline status:', error);
			}
		}, this.offlineDaemonInterval);

		this.purgeTimer = setInterval(async () => {
			try {
				await dbRun(`
					DELETE FROM users
					WHERE status != 'online'
					AND (strftime('%s','now') - last_seen) > ?
				`, [this.deathDelaySec]);
			} catch (error) {
				console.error('[User: UserLifecycleDaemon] Failed to suppress old accounts:', error);
			}
		}, this.purgeDaemonInterval);
	}

	stop() {
		console.log("[User: UserLifecycleDaemon] Stopping user lifecycle daemon...");
		if (this.statusTimer) {
			clearInterval(this.statusTimer);
			this.statusTimer = undefined;
		}
		if (this.purgeTimer) {
			clearInterval(this.purgeTimer);
			this.purgeTimer = undefined;
		}
	}
		
}
