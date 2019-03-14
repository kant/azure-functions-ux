import { RESOURCE_GROUPS_FETCH_REQUEST, RESOURCE_GROUPS_FETCH_SUCCESS, RESOURCE_GROUPS_FETCH_FAILURE } from './actionTypes';
import { createStandardAction } from 'typesafe-actions';
import { ArmArray } from '../../../models/WebAppModels';
import { ResourceGroup } from '../../../models/resource-group';

export const fetchResourceGroupsRequest = createStandardAction(RESOURCE_GROUPS_FETCH_REQUEST)();

export const fetchResourceGroupsSuccess = createStandardAction(RESOURCE_GROUPS_FETCH_SUCCESS).map(
  (resourceGroups: ArmArray<ResourceGroup>) => ({
    resourceGroups,
  })
);
export const fetchResourceGroupsFailure = createStandardAction(RESOURCE_GROUPS_FETCH_FAILURE).map((error: Error) => ({
  error,
}));
