import { ResourceGroup } from '../../../models/resource-group';
import { ArmArray } from '../../../models/WebAppModels';
import MakeArmCall from '../../ArmHelper';
import { RootState } from '../../types';
import { ArmSubcriptionDescriptor } from '../../../utils/resourceDescriptors';

const resourceGroupsApi = {
  fetchResourceGroups: (state: RootState): Promise<ArmArray<ResourceGroup>> => {
    const siteId = state.site.resourceId;
    const descriptor = new ArmSubcriptionDescriptor(siteId);
    const resourceId = `/subscriptions/${descriptor.subscriptionId}/resourceGroups`;

    const apiVersion = '2018-11-01';
    return MakeArmCall<ArmArray<ResourceGroup>>({
      resourceId,
      commandName: 'FetchResourceGroups',
      apiVersion,
    });
  },
};

export default resourceGroupsApi;
