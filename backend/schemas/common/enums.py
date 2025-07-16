from enum import Enum


class Audition(str, Enum):
    DSS = "core-service"


class Authority(str, Enum):
    STRATEGIC_COORDINATION = "utm.strategic_coordination"
    CONSTRAINT_MANAGEMENT = "utm.constraint_management"
    CONSTRAINT_PROCESSING = "utm.constraint_processing"
    CONFORMANCE_MONITORING_SA = "utm.conformance_monitoring_sa"
    AVAILABILITY_ARBITRATION = "utm.availability_arbitration"
    AVIATION_AUTHORITY = "utm.aviation_authority"


class FlightType(str, Enum):
    VLOS = "VLOS"
    EVLOS = "EVLOS"
    BVLOS = "BVLOS"


class TimeFormat(str, Enum):
    RFC3339 = "RFC3339"


class RadiusUnits(str, Enum):
    M = "M"


class AltitudeReference(str, Enum):
    W84 = "W84"


class AltitudeUnits(str, Enum):
    M = "M"


class OperationalIntentState(str, Enum):
    ACCEPTED = "Accepted"
    ACTIVATED = "Activated"
    NONCONFORMING = "Nonconforming"
    CONTINGENT = "Contingent"


class PositionAccuracyVertical(str, Enum):
    VA_UNKNOWN = "VAUnknown"
    VA_150M_PLUS = "VA150mPlus"
    VA_150M = "VA150m"
    VA_45M = "VA45m"
    VA_25M = "VA25m"
    VA_10M = "VA10m"
    VA_3M = "VA3m"
    VA_1M = "VA1m"


class PositionAccuracyHorizontal(str, Enum):
    HA_UNKNOWN = "HAUnknown"
    HA_10NM_PLUS = "HA10NMPlus"
    HA_10NM = "HA10NM"
    HA_4NM = "HA4NM"
    HA_2NM = "HA2NM"
    HA_1NM = "HA1NM"
    HA_05NM = "HA05NM"
    HA_03NM = "HA03NM"
    HA_01NM = "HA01NM"
    HA_005NM = "HA005NM"
    HA_30M = "HA30m"
    HA_10M = "HA10m"
    HA_3M = "HA3m"
    HA_1M = "HA1m"


class VelocityUnitsSpeed(str, Enum):
    METERS_PER_SECOND = "MetersPerSecond"


class UssAvailabilityState(str, Enum):
    UNKNOWN = "Unknown"
    NORMAL = "Normal"
    DOWN = "Down"


class RecorderRole(str, Enum):
    CLIENT = "Client"
    SERVER = "Server"


class CodeZoneType(str, Enum):
    COMMON = "COMMON"
    CUSTOMIZED = "CUSTOMIZED"
    PROHIBITED = "PROHIBITED"
    REQ_AUTHORISATION = "REQ_AUTHORISATION"
    CONDITIONAL = "CONDITIONAL"
    NO_RESTRICTION = "NO_RESTRICTION"


class CodeZoneReason(str, Enum):
    AIR_TRAFFIC = "AIR_TRAFFIC"
    SENSITIVE = "SENSITIVE"
    PRIVACY = "PRIVACY"
    POPULATION = "POPULATION"
    NATURE = "NATURE"
    NOISE = "NOISE"
    FOREIGN_TERRITORY = "FOREIGN_TERRITORY"
    EMERGENCY = "EMERGENCY"
    OTHER = "OTHER"


class CodeYesNo(str, Enum):
    YES = "YES"
    NO = "NO"


class CodeAuthorityRole(str, Enum):
    AUTHORIZATION = "AUTHORIZATION"
    NOTIFICATION = "NOTIFICATION"
    INFORMATION = "INFORMATION"


class OperationProfile(str, Enum):
    PADRAO = "Padrão"
    ESPECIAL_ORGAOS_GOVERNO = "Especial - Órgãos de Governo"
    ESPECIAL_OUTROS = "Especial - Outros"
    AEROLEVANTAMENTO = "Aerolevantamento"
    ENTORNO_ESTRUTURA = "Entorno de Estrutura"
    AEROAGRICOLA = "Aeroagrícola"
    ATIPICO = "Atípico"


class ContingencyStrategy(str, Enum):
    RTH = "Return to Home (RTH)"
    PARACHUTE = "Parachute"


class UserNotificationEvent(str, Enum):
    GEN0400 = "GEN0400"
    GEN0405 = "GEN0405"
    SCD0090 = "SCD0090"
    SCD0095 = "SCD0095"
    ACM0010 = "ACM0010"
    CMSA0115 = "CMSA0115"
    CMSA0300 = "CMSA0300"
    CSTP0005 = "CSTP0005"
    CSTP0010 = "CSTP0010"
    CSTP0020 = "CSTP0020"
    CSTP0025 = "CSTP0025"
    CSTP0030 = "CSTP0030"
    CSTP0035 = "CSTP0035"
