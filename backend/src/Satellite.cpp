#include "Satellite.h"

std::string getTLEAccuracy(int age)
{
    if (age < 86400)
        return "Excellent";

    if (age < 7 * 86400)
        return "Good";

    if (age < 30 * 86400)
        return "Aged";

    return "Poor";
};

std::string getTLEAccuracyColour(std::string accuracy)
{
    if (accuracy == "Excellent")
        return "green";

    if (accuracy == "Good")
        return "lightgreen";

    if (accuracy == "Aged")
        return "yellow";

    if (accuracy == "Poor")
        return "orange";

    if (accuracy == "Decayed")
        return "red";
}

Satellite::Satellite()
{
}

Satellite::Satellite(std::string name, SatelliteType satelliteType, std::string colour, std::string TLE1, std::string TLE2)
{
    this->name = name;
    this->satelliteType = satelliteType;
    this->colour = colour;
    this->TleLineOne = TLE1;
    this->TleLineTwo = TLE2;

    libsgp4::Tle TleObject = libsgp4::Tle(name, TLE1, TLE2);
    propogator = std::make_unique<libsgp4::SGP4>(TleObject);

    this->NORAD = std::to_string(TleObject.NoradNumber());
}

libsgp4::CoordGeodetic Satellite::getCurrentPosition(std::time_t startDate, double tSince)
{
    startDate += tSince;
    std::tm *utc_time = std::gmtime(&startDate);

    libsgp4::DateTime currentTime = libsgp4::DateTime(
        utc_time->tm_year + 1900,
        utc_time->tm_mon + 1,
        utc_time->tm_mday,
        utc_time->tm_hour,
        utc_time->tm_min,
        utc_time->tm_sec);

    try
    {
        libsgp4::Eci position = propogator->FindPosition(currentTime);
        return position.ToGeodetic();
    }
    catch (const std::exception &e)
    {
        return libsgp4::CoordGeodetic(0, 0, 0, false);
    };
}

libsgp4::Vector Satellite::getCurrentVelocity(std::time_t startDate, double tSince)
{
    startDate += tSince;
    std::tm *utc_time = std::gmtime(&startDate);

    libsgp4::DateTime currentTime = libsgp4::DateTime(
        utc_time->tm_year + 1900,
        utc_time->tm_mon + 1,
        utc_time->tm_mday,
        utc_time->tm_hour,
        utc_time->tm_min,
        utc_time->tm_sec);

    try
    {
        libsgp4::Eci position = propogator->FindPosition(currentTime);
        return position.Velocity();
    }
    catch (const std::exception &e)
    {
        return libsgp4::Vector(0, 0, 0);
    }
}

std::string Satellite::getSatelliteTypeStr(SatelliteType satelliteType)
{
    switch (satelliteType)
    {
    case SatelliteType::SpaceStation:
        return "Space Station";
    case SatelliteType::Weather:
        return "Weather";
    case SatelliteType::EarthResources:
        return "Earth Resources";
    case SatelliteType::SyntheticApertureRadar:
        return "Synthetic Aperture Radar";
    case SatelliteType::SearchAndRescue:
        return "Search & Rescue";
    case SatelliteType::DisasterMonitoring:
        return "Disaster Monitoring";
    case SatelliteType::TrackingAndDataRelay:
        return "Tracking and Data Relay";
    case SatelliteType::Argos:
        return "ARGOS";
    case SatelliteType::Planet:
        return "Planet";
    case SatelliteType::Spire:
        return "Spire";

    case SatelliteType::ActiveGeosynchronous:
        return "Active Geosynchronous";
    case SatelliteType::GeoProtectedZone:
        return "GEO Protected Zone";
    case SatelliteType::GeoProtectedZonePlus:
        return "GEO Protected Zone Plus";
    case SatelliteType::Intelsat:
        return "Intelsat";
    case SatelliteType::SES:
        return "SES";
    case SatelliteType::Eutelsat:
        return "Eutelsat";
    case SatelliteType::Telesat:
        return "Telesat";
    case SatelliteType::Starlink:
        return "Starlink";
    case SatelliteType::OneWeb:
        return "OneWeb";
    case SatelliteType::Qianfan:
        return "Qianfan";
    case SatelliteType::HulianwangDigui:
        return "Hulianwang Digui";
    case SatelliteType::Kuiper:
        return "Kuiper";
    case SatelliteType::IridiumNext:
        return "Iridium NEXT";
    case SatelliteType::Orbcomm:
        return "Orbcomm";
    case SatelliteType::Globalstar:
        return "Globalstar";
    case SatelliteType::AmateurRadio:
        return "Amateur Radio";
    case SatelliteType::SatNOGS:
        return "SatNOGS";
    case SatelliteType::ExperimentalComm:
        return "Experimental Comm";
    case SatelliteType::OtherComm:
        return "Other Comm";

    case SatelliteType::GNSS:
        return "GNSS";
    case SatelliteType::GPS:
        return "GPS";
    case SatelliteType::GLONASS:
        return "GLONASS";
    case SatelliteType::Galileo:
        return "Galileo";
    case SatelliteType::BeiDou:
        return "BeiDou";
    case SatelliteType::SatelliteBasedAugmentation:
        return "Satellite Based Augmentation";

    case SatelliteType::SpaceAndEarthScience:
        return "Space & Earth Science";
    case SatelliteType::Geodetic:
        return "Geodetic";
    case SatelliteType::Engineering:
        return "Engineering";
    case SatelliteType::Education:
        return "Education";

    case SatelliteType::MiscellaneousMilitary:
        return "Miscellaneous Military";
    case SatelliteType::RadarCalibration:
        return "Radar Calibration";
    case SatelliteType::CubeSats:
        return "CubeSats";
    }

    return "Unknown";
}

std::string Satellite::getSatelliteGroupType(SatelliteType satelliteType)
{
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

SatelliteDTO Satellite::getDTO(std::time_t startDate, double tSince)
{
    libsgp4::CoordGeodetic pos = getCurrentPosition(startDate, tSince);
    return SatelliteDTO(name, NORAD, colour, pos.latitude, pos.longitude, pos.altitude);
}

SatelliteDetails Satellite::getDetails(std::time_t startDate, double tSince)
{
    std::vector<std::string> months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

    libsgp4::CoordGeodetic pos = getCurrentPosition(startDate, tSince);
    libsgp4::Vector vel = getCurrentVelocity(startDate, tSince);

    libsgp4::Tle tle = libsgp4::Tle(name, TleLineOne, TleLineTwo);
    SatelliteDetails details;

    details.tleData = name + "\n" + TleLineOne + "\n" + TleLineTwo;
    details.name = name;
    details.colour = colour;
    details.group = getSatelliteGroupType(satelliteType);
    details.type = getSatelliteTypeStr(satelliteType);

    startDate += tSince;
    std::tm *local_time = std::localtime(&startDate);
    libsgp4::DateTime currentTime = libsgp4::DateTime(local_time->tm_year + 1900, local_time->tm_mon + 1, local_time->tm_mday, local_time->tm_hour, local_time->tm_min, local_time->tm_sec);

    int secs = (currentTime - tle.Epoch()).TotalSeconds();
    details.tleAccuracy = getTLEAccuracy(secs);
    if (secs >= 86400)
        details.tleAge = std::to_string((currentTime - tle.Epoch()).Days()) + " Days";
    else
        details.tleAge = std::to_string((currentTime - tle.Epoch()).Hours()) + " Hours";

    if (pos.altitude == 0)
        details.tleAccuracy = "Decayed";

    details.tleAgeColour = getTLEAccuracyColour(details.tleAccuracy);

    details.lat = pos.latitude;
    details.lon = pos.longitude;
    details.alt = pos.altitude;

    details.velX = vel.x;
    details.velY = vel.y;
    details.velZ = vel.z;

    details.epoch = months[tle.Epoch().Month() - 1] + " " + std::to_string(tle.Epoch().Day()) + ", " + std::to_string(tle.Epoch().Year()) + " at " + (std::to_string(tle.Epoch().Hour()).size() == 1 ? "0" + std::to_string(tle.Epoch().Hour()) : std::to_string(tle.Epoch().Hour())) + ":" + (std::to_string(tle.Epoch().Minute()).size() == 1 ? "0" + std::to_string(tle.Epoch().Minute()) : std::to_string(tle.Epoch().Minute())) + ":" + (std::to_string(tle.Epoch().Second()).size() == 1 ? "0" + std::to_string(tle.Epoch().Second()) : std::to_string(tle.Epoch().Second()));
    details.NORAD = tle.NoradNumber();
    details.designator = tle.IntDesignator();

    details.inclination = tle.Inclination(true);
    details.RAAN = tle.RightAscendingNode(true);
    details.eccentricity = tle.Eccentricity();
    details.argumentPerigee = tle.ArgumentPerigee(true);
    details.meanAnomaly = tle.MeanAnomaly(true);
    details.orbitNumber = tle.OrbitNumber();

    details.meanMotion = tle.MeanMotion();
    details.meanMotionDT2 = tle.MeanMotionDt2();
    details.meanMotionDDT6 = tle.MeanMotionDdt6();
    details.bSTAR = tle.BStar();

    return details;
}

float Satellite::getMeanMotion()
{
    libsgp4::Tle TleObject = libsgp4::Tle(name, TleLineOne, TleLineTwo);
    return TleObject.MeanMotion();
}
