#include <iostream>
#include <vector>
#include <string>
#include <cctype>
#include <cmath>
#include <ctime>
#include "SGP4.h"
#include "Tle.h"

// enum class SatelliteGroup
// {
//     EarthObservation,
//     Communication,
//     Navigation,
//     Research,
//     Miscallaneous
// }

enum class SatelliteType
{
    SpaceStation,
    Weather,
    EarthResources,
    SyntheticApertureRadar,
    SearchAndRescue,
    DisasterMonitoring,
    TrackingAndDataRelay,
    Argos,
    Planet,
    Spire,

    ActiveGeosynchronous,
    GeoProtectedZone,
    GeoProtectedZonePlus,
    Intelsat,
    SES,
    Eutelsat,
    Telesat,
    Starlink,
    OneWeb,
    Qianfan,
    HulianwangDigui,
    Kuiper,
    IridiumNext,
    Orbcomm,
    Globalstar,
    AmateurRadio,
    SatNOGS,
    ExperimentalComm,
    OtherComm,

    GNSS,
    GPS,
    GLONASS,
    Galileo,
    BeiDou,
    SatelliteBasedAugmentation,

    SpaceAndEarthScience,
    Geodetic,
    Engineering,
    Education,

    MiscellaneousMilitary,
    RadarCalibration,
    CubeSats,

    Unknown
};

struct Position
{
    double lat, lon, alt;
    Position() {}
    Position(double lat, double lon, double alt)
    {
        this->lat = lat;
        this->lon = lon;
        this->alt = alt;
    }
};

struct SatelliteDTO
{
    std::string name, NORAD, colour;
    double lat, lon, alt;
    SatelliteDTO()
    {
    }
    SatelliteDTO(std::string name, std::string NORAD, std::string colour, double lat, double lon, double alt)
    {
        this->name = name;
        this->NORAD = NORAD;
        this->colour = colour;
        this->lat = lat;
        this->lon = lon;
        this->alt = alt;
    }
};

struct SatelliteDetails
{
    // Basic Information
    std::string name;
    std::string tleData;
    std::string tleAge;
    std::string tleAccuracy;
    std::string tleAgeColour;
    std::string colour;
    std::string group;
    std::string type;
    std::string epoch;
    std::string designator;

    int NORAD;
    int orbitNumber;

    // Position
    double lat;
    double lon;
    double alt;

    // Velocity
    double velX;
    double velY;
    double velZ;

    // Orbital Elements
    double inclination;
    double RAAN;
    double eccentricity;
    double argumentPerigee;
    double meanAnomaly;

    // TLE Data
    double meanMotion;
    double meanMotionDT2;
    double meanMotionDDT6;
    double bSTAR;

    SatelliteDetails()
        : NORAD(0),
          orbitNumber(0),
          lat(0.0),
          lon(0.0),
          alt(0.0),
          velX(0.0),
          velY(0.0),
          velZ(0.0),
          inclination(0.0),
          RAAN(0.0),
          eccentricity(0.0),
          argumentPerigee(0.0),
          meanAnomaly(0.0),
          meanMotion(0.0),
          meanMotionDT2(0.0),
          meanMotionDDT6(0.0),
          bSTAR(0.0)
    {
    }

    SatelliteDetails(
        const std::string &name,
        const std::string &colour,
        double lat,
        double lon,
        double alt)
        : name(name),
          colour(colour),
          lat(lat),
          lon(lon),
          alt(alt),
          designator(""),
          NORAD(0),
          orbitNumber(0),
          velX(0.0),
          velY(0.0),
          velZ(0.0),
          inclination(0.0),
          RAAN(0.0),
          eccentricity(0.0),
          argumentPerigee(0.0),
          meanAnomaly(0.0),
          meanMotion(0.0),
          meanMotionDT2(0.0),
          meanMotionDDT6(0.0),
          bSTAR(0.0)
    {
    }
};

class Satellite
{
private:
    SatelliteType satelliteType;
    std::string name, NORAD, colour, TleLineOne, TleLineTwo;
    double meanMotion;
    std::unique_ptr<libsgp4::SGP4> propogator;

public:
    Satellite();
    Satellite(std::string name, SatelliteType satelliteType, std::string colour, std::string TLE1, std::string TLE2);
    static std::string getSatelliteTypeStr(SatelliteType satelliteType);
    std::string getSatelliteGroupType(SatelliteType satelliteType);
    std::string getName() { return name; };
    std::string getNORAD() { return NORAD; };
    libsgp4::CoordGeodetic getCurrentPosition(std::time_t startDate, double tSince);
    libsgp4::Vector getCurrentVelocity(std::time_t startDate, double tSince);
    SatelliteType getSatelliteType() { return satelliteType; }
    SatelliteDTO getDTO(std::time_t startDate, double tSince);
    SatelliteDetails getDetails(std::time_t startDate, double tSince);
    float getMeanMotion();
};
