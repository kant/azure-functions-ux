import React, { useState, useEffect } from 'react';
import { ArmObj, Site, ArmArray, ServerFarm } from '../../../models/WebAppModels';
import { ResourceGroup } from '../../../models/resource-group';
import { ArmSubcriptionDescriptor } from '../../../utils/resourceDescriptors';
import ChangeAppPlan from './ChangeAppPlan';
import LoadingComponent from '../../../components/loading/loading-component';
import SiteService from '../../../ApiHelpers/SiteService';
import ResourceGroupService from '../../../ApiHelpers/ResourceGroupService';
import ServerFarmService from '../../../ApiHelpers/ServerFarmService';

interface ChangeAppPlanDataLoaderProps {
  resourceId: string;
}

const ChangeAppPlanDataLoader: React.SFC<ChangeAppPlanDataLoaderProps> = props => {
  const [site, setSite] = useState<ArmObj<Site> | null>(null);
  const [resourceGroups, setResourceGroups] = useState<ArmArray<ResourceGroup> | null>(null);
  const [serverFarms, setServerFarms] = useState<ArmObj<ServerFarm>[] | null>(null);

  const resourceId = props.resourceId;

  const fetchData = async () => {
    const descriptor = new ArmSubcriptionDescriptor(resourceId);

    await Promise.all([SiteService.fetchSite(resourceId), ResourceGroupService.fetchResourceGroups(descriptor.subscriptionId)])
      .then(responses => {
        const s = responses[0].data;
        setSite(responses[0].data);
        setResourceGroups(responses[1].data);

        return ServerFarmService.fetchServerFarmsForWebspace(descriptor.subscriptionId, s.properties.webSpace);
      })
      .then(s => {
        setServerFarms(s.data);
      });
  };

  useEffect(
    () => {
      fetchData();
    },
    [resourceId]
  );

  // etodo: need to optimize for serverFarm loading taking longer
  if (!site || !resourceGroups) {
    return <LoadingComponent />;
  }

  return (
    <>
      <ChangeAppPlan site={site} resourceGroups={resourceGroups} serverFarms={serverFarms} />
    </>
  );
};

export default ChangeAppPlanDataLoader;
