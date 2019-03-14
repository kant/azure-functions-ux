import React from 'react';
import FeatureDescriptionCard from '../../../components/feature-description-card/FeatureDescriptionCard';
import { IDropdownOption } from 'office-ui-fabric-react';
import { Formik, FormikActions, FormikProps, Field } from 'formik';
import { ResourceGroup } from '../../../models/resource-group';
import { ArmObj, Site, ArmArray } from '../../../models/WebAppModels';
import CreateOrSelect, { CreateOrSelectFormValues } from '../../../components/form-controls/CreateOrSelect';

export interface ChangeAppPlanProps {
  // site: SiteState;
  // resourceGroups: ResourceGroupsState;
  site: ArmObj<Site>;
  resourceGroups: ArmArray<ResourceGroup> | null;
}

export interface ChangeAppPlanFormValues {
  resourceGroupInfo: CreateOrSelectFormValues<ArmObj<ResourceGroup>>;
}

const onSubmit = async (values: any, actions: FormikActions<any>) => {
  console.log('submit!');
};

const ChangeAppPlan: React.SFC<ChangeAppPlanProps> = props => {
  const { resourceGroups } = props;

  const formValues: ChangeAppPlanFormValues = {
    resourceGroupInfo: {
      newOrExisting: 'new',
      existingValue: null,
      newValue: '',
      loading: !resourceGroups,
    },
  };

  let rgOptions: IDropdownOption[] = [];
  if (resourceGroups) {
    for (const rg of resourceGroups.value) {
      rgOptions = [
        ...rgOptions,
        {
          key: rg.id,
          text: rg.name,
          data: rg,
        },
      ];
    }
  }

  return (
    <>
      <Formik initialValues={formValues} onSubmit={onSubmit}>
        {(formProps: FormikProps<ChangeAppPlanFormValues>) => (
          <form>
            <h1>Change app plan inner component</h1>
            <FeatureDescriptionCard name="foo" description="my description!!!" iconUrl="/images/app-service-plan.svg" />
            <Field
              name="resourceGroupInfo"
              component={CreateOrSelect}
              fullpage
              label="Target Resource Group"
              id="resource-group-picker"
              options={rgOptions}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangeAppPlan;
