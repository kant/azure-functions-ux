import React from 'react';
import FeatureDescriptionCard from '../../../components/feature-description-card/FeatureDescriptionCard';
import { IDropdownOption } from 'office-ui-fabric-react';
import { Formik, FormikActions, FormikProps, Field } from 'formik';
import { ResourceGroup } from '../../../models/resource-group';
import { ArmObj, Site, ArmArray, ServerFarm } from '../../../models/WebAppModels';
import CreateOrSelect, { CreateOrSelectFormValues } from '../../../components/form-controls/CreateOrSelect';

export interface ChangeAppPlanProps {
  site: ArmObj<Site> | null;
  resourceGroups: ArmArray<ResourceGroup> | null;
  serverFarms: ArmObj<ServerFarm>[] | null;
}

export interface ChangeAppPlanFormValues {
  resourceGroupInfo: CreateOrSelectFormValues<ArmObj<ResourceGroup>>;
  serverFarmInfo: CreateOrSelectFormValues<ArmObj<ServerFarm>>;
}

const onSubmit = async (values: any, actions: FormikActions<any>) => {
  console.log('submit!');
};

const getDropdownOptions = (objs: ArmObj<any>[]) => {
  let options: IDropdownOption[] = [];
  if (objs) {
    for (const obj of objs) {
      options = [
        ...options,
        {
          key: obj.id,
          text: obj.name,
          data: obj,
        },
      ];
    }
  }

  return options;
};

const ChangeAppPlan: React.SFC<ChangeAppPlanProps> = props => {
  const { resourceGroups, serverFarms } = props;

  const formValues: ChangeAppPlanFormValues = {
    resourceGroupInfo: {
      newOrExisting: 'new',
      existingValue: null,
      newValue: '',
      loading: !resourceGroups,
    },
    serverFarmInfo: {
      newOrExisting: 'new',
      existingValue: null,
      newValue: '',
      loading: !serverFarms,
    },
  };

  const rgOptions = getDropdownOptions((resourceGroups as ArmArray<ResourceGroup>).value);
  const serverFarmOptions = getDropdownOptions(serverFarms as ArmObj<ServerFarm>[]);

  return (
    <>
      <Formik initialValues={formValues} onSubmit={onSubmit}>
        {(formProps: FormikProps<ChangeAppPlanFormValues>) => (
          <form>
            <FeatureDescriptionCard
              name="Changeplandescription"
              description="Change app service plan description"
              iconUrl="/images/app-service-plan.svg"
            />

            <Field
              name="resourceGroupInfo"
              component={CreateOrSelect}
              fullpage
              label="Target Resource Group"
              id="resource-group-picker"
              options={rgOptions}
            />

            <Field
              name="serverFarmInfo"
              component={CreateOrSelect}
              fullpage
              label="Target Server Farm"
              id="server-farm-picker"
              options={serverFarmOptions}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangeAppPlan;
