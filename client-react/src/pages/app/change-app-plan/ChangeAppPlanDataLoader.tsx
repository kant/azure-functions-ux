import * as React from 'react';
import { useState, useEffect } from 'react';
import MakeArmCall from '../../../modules/ArmHelper';
import { ArmObj, Site, ArmArray } from '../../../models/WebAppModels';
import { ResourceGroup } from '../../../models/resource-group';
import { ArmSubcriptionDescriptor } from '../../../utils/resourceDescriptors';
import ChangeAppPlan from './ChangeAppPlan';
import { LoadingComponent } from '../../../components/loading/loading-component';

interface StateProps {
  resourceId: string;
}

const ChangeAppPlanDataLoader: React.SFC<StateProps> = props => {
  const [site, setSite] = useState<ArmObj<Site> | null>(null);
  const [resourceGroups, setResourceGroups] = useState<ArmArray<ResourceGroup> | null>(null);

  const resourceId = props.resourceId;

  const fetchData = async () => {
    const descriptor = new ArmSubcriptionDescriptor(resourceId);
    const resourceGroupsId = `/subscriptions/${descriptor.subscriptionId}/resourceGroups`;

    await Promise.all([
      MakeArmCall<ArmObj<Site>>({ resourceId, commandName: 'fetchSite' }).then(r => setSite(r)),
      MakeArmCall<ArmArray<ResourceGroup>>({ resourceId: resourceGroupsId, commandName: 'fetchResourceGroup' }).then(r =>
        setResourceGroups(r)
      ),
    ]);
  };

  useEffect(
    () => {
      fetchData();
    },
    [resourceId]
  );

  if (!site) {
    return <LoadingComponent pastDelay={true} error={false} isLoading={true} timedOut={false} retry={() => null} t={s => s} />;
  }

  return (
    <>
      <ChangeAppPlan site={site} resourceGroups={resourceGroups} />
    </>
  );
};

export default ChangeAppPlanDataLoader;
