import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';
import { ArmArray, ServerFarm } from '../../../models/WebAppModels';
import { metadataReducer } from '../../ApiReducerHelper';
import { ApiState } from '../../types';
import * as actions from './actions';
import { AREA_STRING, SUBSCRIPTION_SERVERFARMS_FETCH_SUCCESS } from './actionTypes';

export type SubscriptionServerFarmsAction = ActionType<typeof actions>;
export type SubscriptionServerFarmsState = ApiState<ArmArray<ServerFarm>>;
export const InitialState = {
  data: {
    value: [],
  },
};

export default combineReducers<SubscriptionServerFarmsState, SubscriptionServerFarmsAction>({
  metadata: metadataReducer(AREA_STRING),
  data: (state = InitialState.data, action) => {
    switch (action.type) {
      case SUBSCRIPTION_SERVERFARMS_FETCH_SUCCESS:
        return action.serverFarms;
      default:
        return state;
    }
  },
});
