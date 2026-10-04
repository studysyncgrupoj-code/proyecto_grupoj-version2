/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CancelAccountDeactivation {\n  cancelAccountDeactivation {\n    status\n    createdAt\n  }\n}": typeof types.CancelAccountDeactivationDocument,
    "query MyAccount {\n  myAccount {\n    status\n    createdAt\n  }\n}": typeof types.MyAccountDocument,
    "mutation RequestAccountDeactivation {\n  requestAccountDeactivation {\n    status\n    createdAt\n  }\n}": typeof types.RequestAccountDeactivationDocument,
    "query MyPreferences {\n  myPreferences {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}": typeof types.MyPreferencesDocument,
    "mutation UpdatePreferences($input: UpdatePreferencesInput!) {\n  updatePreferences(input: $input) {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}": typeof types.UpdatePreferencesDocument,
    "query MyPrivacySettings {\n  myPrivacySettings {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}": typeof types.MyPrivacySettingsDocument,
    "mutation UpdatePrivacySettings($input: UpdatePrivacySettingsInput!) {\n  updatePrivacySettings(input: $input) {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}": typeof types.UpdatePrivacySettingsDocument,
    "query MyProfile {\n  me {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}": typeof types.MyProfileDocument,
    "mutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}": typeof types.UpdateProfileDocument,
    "query MySecuritySettings {\n  mySecuritySettings {\n    email\n    emailVerified\n    twoFactorEnabled\n    twoFactorRequired\n    sessions {\n      id\n      deviceName\n      browser\n      ipAddress\n      lastActiveAt\n      current\n    }\n  }\n}": typeof types.MySecuritySettingsDocument,
    "query MyPersonalData {\n  myPersonalData {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}": typeof types.MyPersonalDataDocument,
    "mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {\n  updatePersonalData(input: $input) {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}": typeof types.UpdatePersonalDataDocument,
};
const documents: Documents = {
    "mutation CancelAccountDeactivation {\n  cancelAccountDeactivation {\n    status\n    createdAt\n  }\n}": types.CancelAccountDeactivationDocument,
    "query MyAccount {\n  myAccount {\n    status\n    createdAt\n  }\n}": types.MyAccountDocument,
    "mutation RequestAccountDeactivation {\n  requestAccountDeactivation {\n    status\n    createdAt\n  }\n}": types.RequestAccountDeactivationDocument,
    "query MyPreferences {\n  myPreferences {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}": types.MyPreferencesDocument,
    "mutation UpdatePreferences($input: UpdatePreferencesInput!) {\n  updatePreferences(input: $input) {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}": types.UpdatePreferencesDocument,
    "query MyPrivacySettings {\n  myPrivacySettings {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}": types.MyPrivacySettingsDocument,
    "mutation UpdatePrivacySettings($input: UpdatePrivacySettingsInput!) {\n  updatePrivacySettings(input: $input) {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}": types.UpdatePrivacySettingsDocument,
    "query MyProfile {\n  me {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}": types.MyProfileDocument,
    "mutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}": types.UpdateProfileDocument,
    "query MySecuritySettings {\n  mySecuritySettings {\n    email\n    emailVerified\n    twoFactorEnabled\n    twoFactorRequired\n    sessions {\n      id\n      deviceName\n      browser\n      ipAddress\n      lastActiveAt\n      current\n    }\n  }\n}": types.MySecuritySettingsDocument,
    "query MyPersonalData {\n  myPersonalData {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}": types.MyPersonalDataDocument,
    "mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {\n  updatePersonalData(input: $input) {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}": types.UpdatePersonalDataDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CancelAccountDeactivation {\n  cancelAccountDeactivation {\n    status\n    createdAt\n  }\n}"): (typeof documents)["mutation CancelAccountDeactivation {\n  cancelAccountDeactivation {\n    status\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyAccount {\n  myAccount {\n    status\n    createdAt\n  }\n}"): (typeof documents)["query MyAccount {\n  myAccount {\n    status\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RequestAccountDeactivation {\n  requestAccountDeactivation {\n    status\n    createdAt\n  }\n}"): (typeof documents)["mutation RequestAccountDeactivation {\n  requestAccountDeactivation {\n    status\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyPreferences {\n  myPreferences {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}"): (typeof documents)["query MyPreferences {\n  myPreferences {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePreferences($input: UpdatePreferencesInput!) {\n  updatePreferences(input: $input) {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}"): (typeof documents)["mutation UpdatePreferences($input: UpdatePreferencesInput!) {\n  updatePreferences(input: $input) {\n    language\n    theme\n    timezone\n    notifications {\n      email\n      push\n      inApp\n    }\n    accessibility {\n      reducedMotion\n      highContrast\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyPrivacySettings {\n  myPrivacySettings {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}"): (typeof documents)["query MyPrivacySettings {\n  myPrivacySettings {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePrivacySettings($input: UpdatePrivacySettingsInput!) {\n  updatePrivacySettings(input: $input) {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}"): (typeof documents)["mutation UpdatePrivacySettings($input: UpdatePrivacySettingsInput!) {\n  updatePrivacySettings(input: $input) {\n    profileVisibility\n    emailVisibility\n    phoneVisibility\n    allowDirectMessages\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyProfile {\n  me {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}"): (typeof documents)["query MyProfile {\n  me {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}"): (typeof documents)["mutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    email\n    image\n    role\n    profile {\n      bio {\n        title\n        description\n      }\n      interests\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MySecuritySettings {\n  mySecuritySettings {\n    email\n    emailVerified\n    twoFactorEnabled\n    twoFactorRequired\n    sessions {\n      id\n      deviceName\n      browser\n      ipAddress\n      lastActiveAt\n      current\n    }\n  }\n}"): (typeof documents)["query MySecuritySettings {\n  mySecuritySettings {\n    email\n    emailVerified\n    twoFactorEnabled\n    twoFactorRequired\n    sessions {\n      id\n      deviceName\n      browser\n      ipAddress\n      lastActiveAt\n      current\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyPersonalData {\n  myPersonalData {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}"): (typeof documents)["query MyPersonalData {\n  myPersonalData {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {\n  updatePersonalData(input: $input) {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}"): (typeof documents)["mutation UpdatePersonalData($input: UpdatePersonalDataInput!) {\n  updatePersonalData(input: $input) {\n    firstName\n    lastName\n    documentId\n    phone\n    country\n    address\n    identityLocked\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;