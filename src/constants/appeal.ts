export const REVERTABLE_FIELDS = [
    'appellantName',
    'appellantResidentialAddressLine1',
    'appellantResidentialAddressLine2',
    'appellantResidentialLandmark',
    'appellantResidentialCity',
    'appellantResidentialDistrict',
    'appellantResidentialState',
    'appellantResidentialCountry',
    'appellantResidentialPinCode',

    'appellantServiceAddressLine1',
    'appellantServiceAddressLine2',
    'appellantServiceLandmark',
    'appellantServiceCity',
    'appellantServiceDistrict',
    'appellantServiceState',
    'appellantServiceCountry',
    'appellantServicePinCode',

    'appellantMobileNumber',
    'appellantEmailAddress',

    'respondentName',

    'respondentOfficeAddressLine1',
    'respondentOfficeAddressLine2',
    'respondentOfficeLandmark',
    'respondentOfficeCity',
    'respondentOfficeDistrict',
    'respondentOfficeState',
    'respondentOfficeCountry',
    'respondentOfficePinCode',

    'respondentServiceAddressLine1',
    'respondentServiceAddressLine2',
    'respondentServiceLandmark',
    'respondentServiceCity',
    'respondentServiceDistrict',
    'respondentServiceState',
    'respondentServiceCountry',
    'respondentServicePinCode',

    'respondentMobileNumber',
    'respondentEmailAddress',

    'projectRegistrationNumber',
    'isFiledWithinLimitation',
    'delayReason',
    'factsOfCase',
    'groundsOfAppeal',
    'reliefSought',
    'interimReliefRequested',
    'isMatterPendingInCourt',
] as const;

export type RevertableField = (typeof REVERTABLE_FIELDS)[number];
