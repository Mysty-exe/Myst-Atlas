#include <Simulation.h>

Simulation::Simulation()
{
    satelliteGroupTypes =
        {
            {"Earth Observation",
             {std::make_pair(SatelliteType::SpaceStation, 0),
              std::make_pair(SatelliteType::Weather, 0),
              std::make_pair(SatelliteType::EarthResources, 0),
              std::make_pair(SatelliteType::SyntheticApertureRadar, 0),
              std::make_pair(SatelliteType::SearchAndRescue, 0),
              std::make_pair(SatelliteType::DisasterMonitoring, 0),
              std::make_pair(SatelliteType::TrackingAndDataRelay, 0),
              std::make_pair(SatelliteType::Argos, 0),
              std::make_pair(SatelliteType::Planet, 0),
              std::make_pair(SatelliteType::Spire, 0)}},

            {"Communication",
             {std::make_pair(SatelliteType::ActiveGeosynchronous, 0),
              std::make_pair(SatelliteType::Intelsat, 0),
              std::make_pair(SatelliteType::SES, 0),
              std::make_pair(SatelliteType::Eutelsat, 0),
              std::make_pair(SatelliteType::Telesat, 0),
              std::make_pair(SatelliteType::Starlink, 0),
              std::make_pair(SatelliteType::OneWeb, 0),
              std::make_pair(SatelliteType::Qianfan, 0),
              std::make_pair(SatelliteType::HulianwangDigui, 0),
              std::make_pair(SatelliteType::Kuiper, 0),
              std::make_pair(SatelliteType::IridiumNext, 0),
              std::make_pair(SatelliteType::Orbcomm, 0),
              std::make_pair(SatelliteType::Globalstar, 0),
              std::make_pair(SatelliteType::AmateurRadio, 0),
              std::make_pair(SatelliteType::SatNOGS, 0),
              std::make_pair(SatelliteType::ExperimentalComm, 0),
              std::make_pair(SatelliteType::OtherComm, 0)}},

            {"Navigation",
             {std::make_pair(SatelliteType::GNSS, 0),
              std::make_pair(SatelliteType::GPS, 0),
              std::make_pair(SatelliteType::GLONASS, 0),
              std::make_pair(SatelliteType::Galileo, 0),
              std::make_pair(SatelliteType::BeiDou, 0),
              std::make_pair(SatelliteType::SatelliteBasedAugmentation, 0)}},

            {"Science & Research",
             {std::make_pair(SatelliteType::SpaceAndEarthScience, 0),
              std::make_pair(SatelliteType::Geodetic, 0),
              std::make_pair(SatelliteType::Engineering, 0),
              std::make_pair(SatelliteType::Education, 0)}},

            {"Miscellaneous",
             {std::make_pair(SatelliteType::MiscellaneousMilitary, 0),
              std::make_pair(SatelliteType::RadarCalibration, 0),
              std::make_pair(SatelliteType::CubeSats, 0)}}};

    satelliteFiles = {
        // Earth Observation / Mission
        {"stations", {SatelliteType::SpaceStation, "#34D399"}},
        {"weather", {SatelliteType::Weather, "#34D399"}},
        {"resource", {SatelliteType::EarthResources, "#34D399"}},
        {"sar", {SatelliteType::SyntheticApertureRadar, "#34D399"}},
        {"sarsat", {SatelliteType::SearchAndRescue, "#34D399"}},
        {"dmc", {SatelliteType::DisasterMonitoring, "#34D399"}},
        {"tdrss", {SatelliteType::TrackingAndDataRelay, "#34D399"}},
        {"argos", {SatelliteType::Argos, "#34D399"}},
        {"planet", {SatelliteType::Planet, "#34D399"}},
        {"spire", {SatelliteType::Spire, "#34D399"}},

        // Communications
        {"geo", {SatelliteType::ActiveGeosynchronous, "#38BDF8"}},
        {"intelsat", {SatelliteType::Intelsat, "#38BDF8"}},
        {"ses", {SatelliteType::SES, "#38BDF8"}},
        {"eutelsat", {SatelliteType::Eutelsat, "#38BDF8"}},
        {"telesat", {SatelliteType::Telesat, "#38BDF8"}},
        {"starlink", {SatelliteType::Starlink, "#38BDF8"}},
        {"oneweb", {SatelliteType::OneWeb, "#38BDF8"}},
        {"qianfan", {SatelliteType::Qianfan, "#38BDF8"}},
        {"hulianwang", {SatelliteType::HulianwangDigui, "#38BDF8"}},
        {"kuiper", {SatelliteType::Kuiper, "#38BDF8"}},
        {"iridium-NEXT", {SatelliteType::IridiumNext, "#38BDF8"}},
        {"orbcomm", {SatelliteType::Orbcomm, "#38BDF8"}},
        {"globalstar", {SatelliteType::Globalstar, "#38BDF8"}},
        {"amateur", {SatelliteType::AmateurRadio, "#38BDF8"}},
        {"satnogs", {SatelliteType::SatNOGS, "#38BDF8"}},
        {"x-comm", {SatelliteType::ExperimentalComm, "#38BDF8"}},
        {"other-comm", {SatelliteType::OtherComm, "#38BDF8"}},

        // Navigation
        {"gnss", {SatelliteType::GNSS, "#A78BFA"}},
        {"gps-ops", {SatelliteType::GPS, "#A78BFA"}},
        {"glo-ops", {SatelliteType::GLONASS, "#A78BFA"}},
        {"galileo", {SatelliteType::Galileo, "#A78BFA"}},
        {"beidou", {SatelliteType::BeiDou, "#A78BFA"}},
        {"sbas", {SatelliteType::SatelliteBasedAugmentation, "#A78BFA"}},

        // Science & Research
        {"science", {SatelliteType::SpaceAndEarthScience, "#FBBF24"}},
        {"geodetic", {SatelliteType::Geodetic, "#FBBF24"}},
        {"engineering", {SatelliteType::Engineering, "#FBBF24"}},
        {"education", {SatelliteType::Education, "#FBBF24"}},

        // Government & Miscellaneous
        {"military", {SatelliteType::MiscellaneousMilitary, "#FB7185"}},
        {"radar", {SatelliteType::RadarCalibration, "#FB7185"}},
        {"cubesat", {SatelliteType::CubeSats, "#FB7185"}}};

    startDate = std::time(nullptr);
};

std::vector<std::string> noradIDs;

void Simulation::initializeSatelliteGroup(std::string group, std::string data)
{
    std::string line, currentName;
    std::string currentTLELine1, currentTLELine2;
    auto type = getSatelliteType(group);
    SatelliteType groupType = std::get<0>(type);
    std::string colour = std::get<1>(type);
    std::vector<Satellite> sats;

    int tleLine = 1;
    std::stringstream ss(data);
    while (std::getline(ss, line))
    {
        if (!line.empty())
        {
            if (tleLine == 1)
                currentName = line;

            else
            {
                if (tleLine == 2)
                    currentTLELine1 = line.substr(0, line.size() - 1);
                if (tleLine == 3)
                    currentTLELine2 = line.substr(0, line.size() - 1);
            }

            if (tleLine == 3)
            {
                Satellite s = Satellite(currentName, groupType, colour, currentTLELine1, currentTLELine2);
                if (std::find(noradIDs.begin(), noradIDs.end(), s.getNORAD()) == noradIDs.end())
                {
                    noradIDs.push_back(s.getNORAD());
                    sats.push_back(std::move(s));
                }
            }

            tleLine = (tleLine + 1 > 3) ? 1 : tleLine + 1;
        }
    }

    std::string g = getSatelliteGroupType(group);
    for (auto &pair : satelliteGroupTypes[g])
    {
        if (pair.first == groupType)
        {
            pair.second = pair.second + sats.size();
            break;
        }
    }

    satellites.push_back(std::make_pair(groupType, std::move(sats)));
}

std::tuple<SatelliteType, std::string> Simulation::getSatelliteType(std::string group)
{
    for (int i = 0; i < satelliteFiles.size(); i++)
        if (satelliteFiles[i].first == group)
            return satelliteFiles[i].second;

    return std::make_tuple(SatelliteType::Unknown, "");
}

std::string Simulation::getSatelliteGroupType(std::string type)
{
    SatelliteType satelliteType = std::get<0>(getSatelliteType(type));

    switch (satelliteType)
    {
    // Earth Observation
    case SatelliteType::SpaceStation:
    case SatelliteType::Weather:
    case SatelliteType::EarthResources:
    case SatelliteType::SyntheticApertureRadar:
    case SatelliteType::SearchAndRescue:
    case SatelliteType::DisasterMonitoring:
    case SatelliteType::TrackingAndDataRelay:
    case SatelliteType::Argos:
    case SatelliteType::Planet:
    case SatelliteType::Spire:
        return "Earth Observation";

    // Communication
    case SatelliteType::ActiveGeosynchronous:
    case SatelliteType::Intelsat:
    case SatelliteType::SES:
    case SatelliteType::Eutelsat:
    case SatelliteType::Telesat:
    case SatelliteType::Starlink:
    case SatelliteType::OneWeb:
    case SatelliteType::Qianfan:
    case SatelliteType::HulianwangDigui:
    case SatelliteType::Kuiper:
    case SatelliteType::IridiumNext:
    case SatelliteType::Orbcomm:
    case SatelliteType::Globalstar:
    case SatelliteType::AmateurRadio:
    case SatelliteType::SatNOGS:
    case SatelliteType::ExperimentalComm:
    case SatelliteType::OtherComm:
        return "Communication";

    // Navigation
    case SatelliteType::GNSS:
    case SatelliteType::GPS:
    case SatelliteType::GLONASS:
    case SatelliteType::Galileo:
    case SatelliteType::BeiDou:
    case SatelliteType::SatelliteBasedAugmentation:
        return "Navigation";

    // Science
    case SatelliteType::SpaceAndEarthScience:
    case SatelliteType::Geodetic:
    case SatelliteType::Engineering:
    case SatelliteType::Education:
        return "Science & Research";

    // Miscellaneous
    case SatelliteType::MiscellaneousMilitary:
    case SatelliteType::RadarCalibration:
    case SatelliteType::CubeSats:
        return "Miscellaneous";

    default:
        return "Unknown";
    }
}

std::vector<std::string> Simulation::getSatelliteGroups()
{
    std::vector<std::string> groups;
    for (int i = 0; i < satelliteFiles.size(); i++)
        groups.push_back(satelliteFiles[i].first);

    return groups;
}

std::vector<SatelliteDTO> Simulation::getSatellitesDTO(std::string group, std::time_t startDate, double tSince)
{
    SatelliteType groupType = std::get<0>(getSatelliteType(group));

    for (int i = 0; i < satellites.size(); i++)
    {
        if (satellites[i].first == groupType)
        {
            std::vector<SatelliteDTO> data;
            for (auto &sat : satellites[i].second)
            {
                data.push_back(sat.getDTO(startDate, tSince));
            }

            return data;
        }
    }

    return {};
}

int Simulation::getSatellitesNum(std::string group)
{
    SatelliteType groupType = std::get<0>(getSatelliteType(group));
    for (int i = 0; i < satellites.size(); i++)
    {
        if (satellites[i].first == groupType)
        {
            return satellites[i].second.size();
        }
    }

    return -1;
}

std::vector<Satellite> &Simulation::getSatelliteGroup(std::string group)
{
    SatelliteType groupType = std::get<0>(getSatelliteType(group));
    for (int i = 0; i < satellites.size(); i++)
    {
        if (satellites[i].first == groupType)
            return satellites[i].second;
    }

    throw std::runtime_error("Satellite group not found: " + group);
}

std::vector<std::string> Simulation::getSatelliteTypes(std::string group)
{
    std::vector<std::string> result;
    for (auto types : satelliteGroupTypes[group])
        result.push_back(Satellite::getSatelliteTypeStr(types.first));

    return result;
}

std::vector<int> Simulation::getSatelliteTypeInts(std::string group)
{
    std::vector<int> result;
    for (auto types : satelliteGroupTypes[group])
        result.push_back(types.second);

    return result;
}

Simulation simulation;
void initializeSatelliteGroup(std::string group, std::string data)
{
    simulation.initializeSatelliteGroup(group, data);
}

std::vector<SatelliteDTO> getSatellitesDTO(std::string group, double tSince)
{
    return simulation.getSatellitesDTO(group, simulation.getStartDate(), tSince);
}

std::vector<std::string> getSatelliteGroups()
{
    return simulation.getSatelliteGroups();
}

int getSatellitesNum(std::string group)
{
    return simulation.getSatellitesNum(group);
}

SatelliteDetails getSpecificSatellite(std::string group, int index, double tSince)
{
    return simulation.getSatelliteGroup(group)[index].getDetails(simulation.getStartDate(), tSince);
}

std::vector<Position> getSatelliteTrajectory(std::string group, int index, double tSince)
{
    std::vector<Position> result;
    Satellite &satellite = simulation.getSatelliteGroup(group)[index];

    int start = 0;
    float periodIncrement = 86400 / satellite.getMeanMotion() / 450;
    for (int i = 0; i < 450; i++)
    {
        libsgp4::CoordGeodetic position = satellite.getCurrentPosition(simulation.getStartDate(), tSince);
        result.push_back(Position(position.latitude, position.longitude, position.altitude));
        tSince += periodIncrement;
    }

    return result;
}

std::vector<std::string> getSatelliteTypes(std::string group)
{
    return simulation.getSatelliteTypes(group);
}

std::vector<int> getSatelliteTypeInts(std::string group)
{
    return simulation.getSatelliteTypeInts(group);
}

std::string getSatelliteGroupColour(std::string group)
{
    if (group == "Earth Observation")
        return "#34D399";

    if (group == "Communication")
        return "#38BDF8";

    if (group == "Navigation")
        return "#A78BFA";

    if (group == "Science & Research")
        return "#FBBF24";

    if (group == "Miscellaneous")
        return "#FB7185";

    return "";
}

EMSCRIPTEN_BINDINGS(my_module)
{
    emscripten::value_object<Position>("Position")
        .field("lat", &Position::lat)
        .field("lon", &Position::lon)
        .field("alt", &Position::alt);

    emscripten::value_object<SatelliteDTO>("SatelliteDTO")
        .field("name", &SatelliteDTO::name)
        .field("NORAD", &SatelliteDTO::NORAD)
        .field("colour", &SatelliteDTO::colour)
        .field("lat", &SatelliteDTO::lat)
        .field("lon", &SatelliteDTO::lon)
        .field("alt", &SatelliteDTO::alt);

    emscripten::value_object<SatelliteDetails>("SatelliteDetails")
        .field("name", &SatelliteDetails::name)
        .field("tleData", &SatelliteDetails::tleData)
        .field("tleAge", &SatelliteDetails::tleAge)
        .field("tleAccuracy", &SatelliteDetails::tleAccuracy)
        .field("tleAgeColour", &SatelliteDetails::tleAgeColour)
        .field("group", &SatelliteDetails::group)
        .field("type", &SatelliteDetails::type)
        .field("colour", &SatelliteDetails::colour)
        .field("epoch", &SatelliteDetails::epoch)
        .field("designator", &SatelliteDetails::designator)

        .field("NORAD", &SatelliteDetails::NORAD)
        .field("orbitNumber", &SatelliteDetails::orbitNumber)

        .field("lat", &SatelliteDetails::lat)
        .field("lon", &SatelliteDetails::lon)
        .field("alt", &SatelliteDetails::alt)

        .field("velX", &SatelliteDetails::velX)
        .field("velY", &SatelliteDetails::velY)
        .field("velZ", &SatelliteDetails::velZ)

        .field("meanMotion", &SatelliteDetails::meanMotion)
        .field("meanMotionDT2", &SatelliteDetails::meanMotionDT2)
        .field("meanMotionDDT6", &SatelliteDetails::meanMotionDDT6)
        .field("bSTAR", &SatelliteDetails::bSTAR)

        .field("inclination", &SatelliteDetails::inclination)
        .field("RAAN", &SatelliteDetails::RAAN)
        .field("eccentricity", &SatelliteDetails::eccentricity)
        .field("argumentPerigee", &SatelliteDetails::argumentPerigee)
        .field("meanAnomaly", &SatelliteDetails::meanAnomaly);

    emscripten::function("initializeSatelliteGroup", &initializeSatelliteGroup);
    emscripten::register_vector<std::string>("SatelliteGroups");
    emscripten::function("getSatelliteGroups", &getSatelliteGroups);
    emscripten::register_vector<SatelliteDTO>("VectorSatellite");
    emscripten::function("getSatellitesDTO", &getSatellitesDTO);
    emscripten::function("getSatellitesNum", &getSatellitesNum);
    emscripten::function("getSpecificSatellite", &getSpecificSatellite);
    emscripten::register_vector<Position>("VectorTrajectory");
    emscripten::function("getSatelliteTrajectory", &getSatelliteTrajectory);
    emscripten::function("getSatelliteTypes", &getSatelliteTypes);
    emscripten::register_vector<int>("SatelliteNums");
    emscripten::function("getSatelliteTypeInts", &getSatelliteTypeInts);
    emscripten::function("getSatelliteGroupColour", &getSatelliteGroupColour);
}
