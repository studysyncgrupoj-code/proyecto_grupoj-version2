/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AccessibilityPreferencesInput = {
  highContrast?: boolean | null | undefined;
  reducedMotion?: boolean | null | undefined;
};

export type AccountStatus =
  | 'active'
  | 'inactive'
  | 'suspended';

export type NotificationPreferencesInput = {
  email?: boolean | null | undefined;
  inApp?: boolean | null | undefined;
  push?: boolean | null | undefined;
};

export type ProfileVisibility =
  | 'authenticated'
  | 'everyone'
  | 'nobody';

export type Theme =
  | 'dark'
  | 'light'
  | 'system';

export type UpdateBioInput = {
  description: string;
  title: string;
};

export type UpdatePersonalDataInput = {
  address?: string | null | undefined;
  country?: string | null | undefined;
  documentId?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  phone?: string | null | undefined;
};

export type UpdatePreferencesInput = {
  accessibility?: AccessibilityPreferencesInput | null | undefined;
  language?: string | null | undefined;
  notifications?: NotificationPreferencesInput | null | undefined;
  theme?: Theme | null | undefined;
  timezone?: string | null | undefined;
};

export type UpdatePrivacySettingsInput = {
  allowDirectMessages?: boolean | null | undefined;
  emailVisibility?: ProfileVisibility | null | undefined;
  phoneVisibility?: ProfileVisibility | null | undefined;
  profileVisibility?: ProfileVisibility | null | undefined;
};

export type UpdateProfileInput = {
  bio?: UpdateBioInput | null | undefined;
  interests?: Array<string> | null | undefined;
};

export type UserRole =
  | 'admin'
  | 'student'
  | 'teacher';

export type CancelAccountDeactivationMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelAccountDeactivationMutation = { cancelAccountDeactivation: { status: AccountStatus, createdAt: unknown } };

export type MyAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAccountQuery = { myAccount: { status: AccountStatus, createdAt: unknown } };

export type RequestAccountDeactivationMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestAccountDeactivationMutation = { requestAccountDeactivation: { status: AccountStatus, createdAt: unknown } };

export type MyPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPreferencesQuery = { myPreferences: { language: string, theme: Theme, timezone: string, notifications: { email: boolean, push: boolean, inApp: boolean }, accessibility: { reducedMotion: boolean, highContrast: boolean } } };

export type UpdatePreferencesMutationVariables = Exact<{
  input: UpdatePreferencesInput;
}>;


export type UpdatePreferencesMutation = { updatePreferences: { language: string, theme: Theme, timezone: string, notifications: { email: boolean, push: boolean, inApp: boolean }, accessibility: { reducedMotion: boolean, highContrast: boolean } } };

export type MyPrivacySettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPrivacySettingsQuery = { myPrivacySettings: { profileVisibility: ProfileVisibility, emailVisibility: ProfileVisibility, phoneVisibility: ProfileVisibility, allowDirectMessages: boolean } };

export type UpdatePrivacySettingsMutationVariables = Exact<{
  input: UpdatePrivacySettingsInput;
}>;


export type UpdatePrivacySettingsMutation = { updatePrivacySettings: { profileVisibility: ProfileVisibility, emailVisibility: ProfileVisibility, phoneVisibility: ProfileVisibility, allowDirectMessages: boolean } };

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = { me: { id: string, name: string, email: string, image: string | null, role: UserRole, profile: { interests: Array<string>, bio: { title: string, description: string } | null } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile: { id: string, name: string, email: string, image: string | null, role: UserRole, profile: { interests: Array<string>, bio: { title: string, description: string } | null } } };

export type MySecuritySettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySecuritySettingsQuery = { mySecuritySettings: { email: string, emailVerified: boolean, twoFactorEnabled: boolean, twoFactorRequired: boolean, sessions: Array<{ id: string, deviceName: string | null, browser: string | null, ipAddress: string | null, lastActiveAt: unknown, current: boolean }> } };

export type MyPersonalDataQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPersonalDataQuery = { myPersonalData: { firstName: string, lastName: string, documentId: string | null, phone: string | null, country: string | null, address: string | null, identityLocked: boolean } };

export type UpdatePersonalDataMutationVariables = Exact<{
  input: UpdatePersonalDataInput;
}>;


export type UpdatePersonalDataMutation = { updatePersonalData: { firstName: string, lastName: string, documentId: string | null, phone: string | null, country: string | null, address: string | null, identityLocked: boolean } };


export const CancelAccountDeactivationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAccountDeactivation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAccountDeactivation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CancelAccountDeactivationMutation, CancelAccountDeactivationMutationVariables>;
export const MyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<MyAccountQuery, MyAccountQueryVariables>;
export const RequestAccountDeactivationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAccountDeactivation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAccountDeactivation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RequestAccountDeactivationMutation, RequestAccountDeactivationMutationVariables>;
export const MyPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"push"}},{"kind":"Field","name":{"kind":"Name","value":"inApp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessibility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reducedMotion"}},{"kind":"Field","name":{"kind":"Name","value":"highContrast"}}]}}]}}]}}]} as unknown as DocumentNode<MyPreferencesQuery, MyPreferencesQueryVariables>;
export const UpdatePreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePreferences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePreferencesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePreferences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"push"}},{"kind":"Field","name":{"kind":"Name","value":"inApp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessibility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reducedMotion"}},{"kind":"Field","name":{"kind":"Name","value":"highContrast"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePreferencesMutation, UpdatePreferencesMutationVariables>;
export const MyPrivacySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPrivacySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPrivacySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profileVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"emailVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"allowDirectMessages"}}]}}]}}]} as unknown as DocumentNode<MyPrivacySettingsQuery, MyPrivacySettingsQueryVariables>;
export const UpdatePrivacySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePrivacySettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePrivacySettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePrivacySettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profileVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"emailVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"phoneVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"allowDirectMessages"}}]}}]}}]} as unknown as DocumentNode<UpdatePrivacySettingsMutation, UpdatePrivacySettingsMutationVariables>;
export const MyProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"interests"}}]}}]}}]}}]} as unknown as DocumentNode<MyProfileQuery, MyProfileQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"interests"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const MySecuritySettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MySecuritySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySecuritySettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorRequired"}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deviceName"}},{"kind":"Field","name":{"kind":"Name","value":"browser"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"lastActiveAt"}},{"kind":"Field","name":{"kind":"Name","value":"current"}}]}}]}}]}}]} as unknown as DocumentNode<MySecuritySettingsQuery, MySecuritySettingsQueryVariables>;
export const MyPersonalDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPersonalData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPersonalData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"identityLocked"}}]}}]}}]} as unknown as DocumentNode<MyPersonalDataQuery, MyPersonalDataQueryVariables>;
export const UpdatePersonalDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePersonalData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePersonalDataInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePersonalData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"identityLocked"}}]}}]}}]} as unknown as DocumentNode<UpdatePersonalDataMutation, UpdatePersonalDataMutationVariables>;