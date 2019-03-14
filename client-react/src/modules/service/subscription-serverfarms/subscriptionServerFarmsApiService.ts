import { ArmArray, ServerFarm } from '../../../models/WebAppModels';
import MakeArmCall from '../../ArmHelper';
import { RootState } from '../../types';
import { ArmSubcriptionDescriptor } from '../../../utils/resourceDescriptors';

const subscriptionServerFarmsApi = {
  fetchSubscriptionServerFarms: (state: RootState): Promise<ArmArray<ServerFarm>> => {
    // etodo: The fact that this depends on the site object seems wrong to me
    const siteId = state.site.resourceId;
    const descriptor = new ArmSubcriptionDescriptor(siteId);
    const resourceId = `/subscriptions/${descriptor.subscriptionId}/providers/microsoft.web/serverfarms`;

    const apiVersion = '2018-11-01';
    return MakeArmCall<ArmArray<ServerFarm>>({
      resourceId,
      commandName: 'FetchSubscriptionResourceGroups',
      apiVersion,
    });
  },
};

export default subscriptionServerFarmsApi;
