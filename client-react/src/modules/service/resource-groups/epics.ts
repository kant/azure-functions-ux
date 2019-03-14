import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootState, Services } from '../../types';
import { ResourceGroupsAction } from './reducer';
import { fetchResourceGroupsSuccess, fetchResourceGroupsFailure, fetchResourceGroupsRequest } from './actions';

export const resourceGroupsFlow: Epic<ResourceGroupsAction, ResourceGroupsAction, RootState, Services> = (
  action$,
  store,
  { resourceGroupsApi }
) =>
  action$.pipe(
    map(a => {
      return a;
    }),
    filter(isActionOf(fetchResourceGroupsRequest)),
    switchMap(action => {
      return from(resourceGroupsApi.fetchResourceGroups(store.value)).pipe(
        map(fetchResourceGroupsSuccess),
        catchError(err => of(fetchResourceGroupsFailure(err)))
      );
    })
  );

export default combineEpics(resourceGroupsFlow);
