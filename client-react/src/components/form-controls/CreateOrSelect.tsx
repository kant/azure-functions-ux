import * as React from 'react';
import { FieldProps } from 'formik';
import get from 'lodash-es/get';
import { connect } from 'react-redux';
import { ThemeExtended } from '../../theme/SemanticColorsExtended';
import { ChoiceGroup, IChoiceGroupProps, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { TextField as OfficeTextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown as OfficeDropdown, IDropdownProps, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { style } from 'typestyle';
import { Label } from 'office-ui-fabric-react';

export interface CreateOrSelectFormValues<T> {
  newOrExisting: 'new' | 'existing';
  existingValue: T | null;
  newValue: string | null;
  loading: boolean;
}

interface CreateOrSelectProps {
  fullpage?: boolean;
  id: string;
  subLabel?: string;
}
interface CreateOrSelectStateProps {
  theme: ThemeExtended;
}

const ChioceGroupStyle = style({
  display: 'inline-block',
  width: 'calc(100%-200px)',
});

const CreateOrSelect = (
  props: FieldProps<CreateOrSelectFormValues<any>> & IChoiceGroupProps & IDropdownProps & CreateOrSelectProps & CreateOrSelectStateProps
) => {
  const { field, form, options, fullpage, theme, label } = props;
  props.options;
  const dirty = get(form.initialValues, field.name, null) !== field.value;
  const formValues = field.value as CreateOrSelectFormValues<any>;

  const createNewRadioOptions: IChoiceGroupOption[] = [
    {
      key: 'new',
      text: 'Create new',
    },
    {
      key: 'existing',
      text: 'Existing',
    },
  ];

  const onChangeRadio = (e: unknown, option: IChoiceGroupOption) => {
    form.setFieldValue(`${field.name}.newOrExisting`, option.key);
  };

  const onChangeDropdown = (e: unknown, option: IDropdownOption) => {
    form.setFieldValue(`${field.name}.existingValue`, option.key);
  };

  const onChangeText = (e: any, value: string) => {
    form.setFieldValue(`${field.name}.newValue`, value);
  };

  const errorMessage = get(form.errors, field.name, '') as string;

  let textOrDropdown: JSX.Element = <span />;
  if (formValues.newOrExisting === 'existing') {
    textOrDropdown = (
      <OfficeDropdown
        placeHolder={form.values.loading ? 'Loading' : ''}
        selectedKey={field.value.existingValue}
        options={options}
        onChange={onChangeDropdown}
        onBlur={field.onBlur}
        errorMessage={errorMessage}
        styles={{
          title: dirty && {
            borderColor: theme.semanticColors.controlDirtyOutline,
          },
          errorMessage: [
            fullpage && {
              paddingLeft: '200px',
            },
          ],
          dropdown: [
            fullpage && {
              display: 'inline-block',
            },
            dirty && {
              selectors: {
                ['&:focus .ms-Dropdown-title']: [{ borderColor: theme.semanticColors.controlDirtyOutline }],
                ['&:hover .ms-Dropdown-title']: [{ borderColor: theme.semanticColors.controlDirtyOutline }],
              },
            },
          ],
        }}
      />
    );
  } else {
    textOrDropdown = (
      <OfficeTextField value={field.value.newValue} onChange={onChangeText} onBlur={field.onBlur} errorMessage={props.errorMessage} />
    );
  }

  return (
    <>
      <Label id={`${props.id}-label`}>{label}</Label>
      <ChoiceGroup
        ariaLabelledBy={`${props.id}-label`}
        id={`${props.id}-radio`}
        className={fullpage ? ChioceGroupStyle : undefined}
        selectedKey={formValues.newOrExisting ? field.value.newOrExisting : 'new'}
        options={createNewRadioOptions}
        onChange={onChangeRadio}
      />

      {textOrDropdown}
    </>
  );
};

const mapStateToProps = state => {
  return {
    theme: state.portalService && state.portalService.theme,
  };
};

export default connect(
  mapStateToProps,
  null
)(CreateOrSelect);
