import axios from "axios";
import client from "../../../utils/radis.connection.js";

class HealthChecker {

    constructor(interval = 5000) {
        this.interval = interval;
    }

    async checkHealth() {

        const config = JSON.parse(
            await client.get("server-config")
        );

        for (const route in config) {

            const service = config[route];
            for (const instance of service.instances) {
                try {
                    await axios.get(
                        
                        `${instance.url}/health`,
                        { timeout: 3000 }
                    );

                    instance.healthy = true;

                } catch (err) {
                    instance.healthy = false;
                }
            }
        }
        await client.set(
            "server-config",
            JSON.stringify(config)
        );
    }

    start() {

        this.checkHealth();

        setInterval(async () => {

            try {
                await this.checkHealth();
            } catch (err) {
                console.error("Health Check Failed:", err.message);
            }

        }, this.interval);
    }
}

export default HealthChecker;