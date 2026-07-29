// @ts-ignore
import createModule from '../../public/wasm/SatelliteCoverage.js';
import type { Satellite } from '../rendering/SatelliteMesh.js';
import { loadTLE, getTLE } from "./db.js";

export interface Location {
    city: string,
    state: string,
    country: string,
    ocean: string
}

const groupNames = [
  "Earth Observation", "Communication", "Navigation", "Science & Research", "Miscellaneous"
]

let Module: any;
let allGroups: string[];
let satelliteGroups: string[];
let tSince: number;
let running = false;

async function start(t: number) {
    Module = await createModule();

    const arr = Module.getSatelliteGroups();
    allGroups = [];
    for (let i = 0; i < arr.size(); i++) {
        allGroups.push(arr.get(i));
    }
    arr.delete();

    satelliteGroups = allGroups.slice();
    tSince = t;

    for (const group of satelliteGroups) {
        await loadTLE(group);
        const data = await getTLE(group);
        Module.initializeSatelliteGroup(group, data);
    }
    
    filterTypes();
    running = true;
    updateLoop();
}

function updateLoop() {
    if (!running) return;

    const data = [];
    for (const group of satelliteGroups)
    {
        const satellites = Module.getSatellitesDTO(group, tSince);

        for (let i = 0; i < satellites.size(); i++) {
            const sat = satellites.get(i);

            data.push({
                name: sat.name,
                NORAD: sat.NORAD,
                colour: sat.colour,
                lat: sat.lat,
                lon: sat.lon,
                alt: sat.alt
            });
        }

        satellites.delete();
    }

    self.postMessage({
        type: "update",
        data: data
        
    });

    setTimeout(updateLoop, 1000 / 60);
}

function filterType(group: string) {
    const result = Module.getSatelliteTypes(group);
    const nums = Module.getSatelliteTypeInts(group);
    const colour = Module.getSatelliteGroupColour(group);

    let total = 0;

    for (let i = 0; i < result.size(); i++) {
        total += nums.get(i);
    }

    let x = [];
    for (let i = 0; i < result.size(); i++) {
        const type = result.get(i);
        x.push([type, colour, total, nums.get(i), true, false]);
    }

    nums.delete();
    result.delete();

    return x;
}

function filterTypes() {
    const filter = new Map();

    groupNames.forEach(name => {
        filter.set(name, filterType(name));
    })

    self.postMessage({
        type: "filter",
        data: filter
    });
}

function updateGroups(groups: Map<string, []>) {
    let i = 0;

    satelliteGroups.length = 0;
    groupNames.forEach(name => {
        const groupTypes: (any[] | undefined) = groups.get(name);
        if (!groupTypes) return;
        groupTypes.forEach((type: number[]) => {
            if (type[4]) {
                satelliteGroups.push(allGroups[i])
            };
            i++;
        });
    });
}

function getSatellite(index: number) 
{
    let start = 0;
    for (const group of satelliteGroups)
    {
        const count = Module.getSatellitesNum(group);

        if (index < start + count) {
            const localIndex = index - start;

            const sat = Module.getSpecificSatellite(group, localIndex, tSince);

            self.postMessage({
                type: "getSatellite",
                satellite: sat
            })

            return;
        }

        start += count;
    }
}

function getTrajectory(index: number) 
{
    let start = 0;
    for (const group of satelliteGroups)
    {
        const count = Module.getSatellitesNum(group);

        if (index < start + count) {
            const localIndex = index - start;

            const data = Module.getSatelliteTrajectory(group, localIndex, tSince);
            const trajectory = [];

            for (let i = 0; i < data.size(); i++) {
                const sat = data.get(i);

                trajectory.push({
                    lat: sat.lat,
                    lon: sat.lon,
                    alt: sat.alt
                });
            }

            data.delete();

            self.postMessage({
                type: "getTrajectory",
                trajectory: trajectory
            })

            return;
        }

        start += count;
    }
}

async function getSatelliteLocation(index: number, points: Satellite[]) {
    const locations = [];

    for (const point of points) {
        const lat = point.lat * (180 / Math.PI);
        const lon = point.lon * (180 / Math.PI);

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=14b7f95ae34e4b4584c63627a15968a2`
        );

        const data = await response.json();

        locations.push({
            city: data.features[0].properties.city,
            state: data.features[0].properties.state,
            country: data.features[0].properties.country,
            ocean: data.features[0].properties.name
        });

    }

    self.postMessage({
        type: "getSatelliteLocation",
        index: index,
        location: locations
    })
}

self.onmessage = async (event) => {
    if (event.data.type === "start") {
        await start(event.data.tSince);
    }

    if (event.data.type === "getSatellite") {
        getSatellite(event.data.index);
    }

    if (event.data.type === "getTrajectory") {
        getTrajectory(event.data.index);
    }

    if (event.data.type === "updateGroups") {
        updateGroups(event.data.groups);
    }

    if (event.data.type == "setTimeRate") {
        tSince = event.data.tSince;
    }

    if (event.data.type == "getSatelliteLocation") {
        getSatelliteLocation(event.data.index, event.data.points);
    }

    if (event.data.type === "stop") {
        running = false;
    }
};
