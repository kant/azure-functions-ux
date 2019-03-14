import { createStandardAction } from 'typesafe-actions';
import { ArmArray, ServerFarm } from '../../../models/WebAppModels';
import {
  SUBSCRIPTION_SERVERFARMS_FETCH_REQUEST,
  SUBSCRIPTION_SERVERFARMS_FETCH_SUCCESS,
  SUBSCRIPTION_SERVERFARMS_FETCH_FAILURE,
} from './actionTypes';

export const fetchSubscriptionServerFarmsRequest = createStandardAction(SUBSCRIPTION_SERVERFARMS_FETCH_REQUEST)();

export const fetchSubscriptionServerFarmsSuccess = createStandardAction(SUBSCRIPTION_SERVERFARMS_FETCH_SUCCESS).map(
  (serverFarms: ArmArray<ServerFarm>) => ({
    serverFarms: serverFarms,
  })
);
export const fetchSubscriptionServerFarmsFailure = createStandardAction(SUBSCRIPTION_SERVERFARMS_FETCH_FAILURE).map((error: Error) => ({
  error,
}));
