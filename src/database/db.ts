import { openDB } from "idb";

let dbPromise = openDB("SatelliteCoverage", 1, {
    upgrade(db) {
        db.createObjectStore("tle");
    },
});

export async function siteUp() {
    try {
        const response = await fetch(
            `https://celestrak.org`
        );

        if (response.status !== 200) {
            console.log("Celestrak Is Down.")
            return false;
        }

    } catch (error) {
        console.log("Celestrak Is Down.")
        return false;
    }

    return true;
}

export async function loadTLE(group: string) {
    const db = await dbPromise;
    const cached = await db.get("tle", group);

    if (
        cached &&
        Date.now() - cached.downloadedAt < 2 * 60 * 60 * 1000
    ) {
        if (cached) {
            if (cached.data.length != 0) {
                return;
            }
        }
    }

     try {
        const response = await fetch(
            `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=tle`
        );

        if (response.status === 403 || response.status === 404) {
            console.log(
                `Response: ${response.status} - Couldn't fetch TLE data for ` + group
            );
            return;
        }

        if (!response.ok) {
            console.log(
                `Response: ${response.status} - Couldn't fetch TLE data for ` + group
            );
            return;
        }

        const text = await response.text();

        if (text.length === 0) {
            console.log("No data found for group:", group);
            return;
        }

        await db.put(
            "tle",
            {
                data: text,
                downloadedAt: Date.now(),
            },
            group
        );

    } catch (error) {
        console.error("Failed to fetch TLE data:", error);
    }
}

export async function getTLE(group: string) {
    const db = await dbPromise;
    const cached = await db.get("tle", group);

    if (!cached) {
        console.error("Missing TLE cache:", group);
        return null;
    }

    return cached.data;
}
