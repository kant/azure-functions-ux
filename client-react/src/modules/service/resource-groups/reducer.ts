import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import { ArmArray } from '../../../models/WebAppModels';
import { metadataReducer } from '../../ApiReducerHelper';
import { ApiState } from '../../types';
import * as actions from './actions';
import { AREA_STRING, RESOURCE_GROUPS_FETCH_SUCCESS } from './actionTypes';
import { ResourceGroup } from '../../../models/resource-group';

export type ResourceGroupsAction = ActionType<typeof actions>;
export type ResourceGroupsState = ApiState<ArmArray<ResourceGroup>>;
export const InitialState = {
  data: {
    value: [],
  },
};

export default combineReducers<ResourceGroupsState, ResourceGroupsAction>({
  metadata: metadataReducer(AREA_STRING),
  data: (state = InitialState.data, action) => {
    switch (action.type) {
      case RESOURCE_GROUPS_FETCH_SUCCESS:
        return action.resourceGroups;
      default:
        return state;
    }
  },
});
