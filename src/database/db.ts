import { openDB } from "idb";

let dbPromise = openDB("SatelliteCoverage", 1, {
    upgrade(db) {
        db.createObjectStore("tle");
    },
});

export async function loadTLE(group: string) {
    const db = await dbPromise;
    const cached = await db.get("tle", group);

    if (
        cached &&
        Date.now() - cached.downloadedAt < 2 * 60 * 60 * 1000
    ) {
        return;
    }

    const response = await fetch(
        `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=tle`
    );

    if (response.status == 403)
        return;

    const text = await response.text();

    await db.put(
        "tle",
        {
            data: text,
            downloadedAt: Date.now(),
        },
        group
    );
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
