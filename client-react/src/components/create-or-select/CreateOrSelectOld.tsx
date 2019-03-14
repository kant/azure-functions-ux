import { Field, FormikProps } from 'formik';
import { IDropdownOption, Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
// import { ArmObj } from '../../models/WebAppModels';
import { RootState } from '../../modules/types';
import { ITheme } from 'office-ui-fabric-react/lib/Styling';

export interface StateProps {
  options: IDropdownOption[];
  optionsLoading: boolean;
  theme: ITheme;
}

export interface CreateOrSelectFormValues {
  option: IDropdownOption;
}

type PropsType = FormikProps<CreateOrSelectFormValues> & InjectedTranslateProps & StateProps;

export class CreateOrSelect extends React.Component<PropsType, any> {
  public render() {
    const { options, optionsLoading } = this.props;
    if (optionsLoading) {
      return null;
    }
    // const options = this.parseLinuxBuiltInStacks(stacks);
    return <Field name="option" component={Dropdown} fullpage label="Resource groups" id="resourcegroupsid" options={options} />;
  }

  //   private parseLinuxBuiltInStacks(builtInStacks: ArmObj<AvailableStack>[]) {
  //     const linuxFxVersionOptions: IDropdownOption[] = [];

  //     builtInStacks.forEach(availableStackArm => {
  //       const availableStack: AvailableStack = availableStackArm.properties;
  //       linuxFxVersionOptions.push({
  //         key: availableStack.name,
  //         text: availableStack.display,
  //         itemType: DropdownMenuItemType.Header,
  //       });
  //       availableStack.majorVersions.forEach(majorVersion => {
  //         linuxFxVersionOptions.push({
  //           text: majorVersion.displayVersion,
  //           key: majorVersion.runtimeVersion,
  //         });
  //       });

  //       linuxFxVersionOptions.push({ key: `${availableStack.name}-divider`, text: '-', itemType: DropdownMenuItemType.Divider });
  //     });

  //     return linuxFxVersionOptions;
  //   }
}
const mapStateToProps = (state: RootState) => ({
  theme: state.portalService.theme,
});
export default compose<PropsType, FormikProps<CreateOrSelectFormValues>>(
  connect(
    mapStateToProps,
    null
  ),
  translate('translation')
)(CreateOrSelect);
