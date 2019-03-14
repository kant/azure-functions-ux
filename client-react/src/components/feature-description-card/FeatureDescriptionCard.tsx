import { RootState } from '../../modules/types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { ITheme } from 'office-ui-fabric-react/lib/Styling';
import * as React from 'react';
import ReactSVG from 'react-svg';
import { style } from 'typestyle';

interface FeatureDescriptionCardProps {
  name: string;
  description: string;
  iconUrl: string;
  learnMoreLink?: string;
}

interface IStateProps {
  theme: ITheme;
}

const iconClass = style({
  height: '20px',
  width: '20px',
});

type FeatureDescriptionCardPropsCombined = FeatureDescriptionCardProps & InjectedTranslateProps & IStateProps;

const FeatureDescriptionCard = (props: FeatureDescriptionCardProps) => {
  const { iconUrl, name, description } = props;

  return (
    <div>
      <span>
        <ReactSVG className={iconClass} src={iconUrl} />
      </span>
      <h2>{name}</h2>
      <h5>{description}</h5>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  theme: state.portalService.theme,
});
export default compose<FeatureDescriptionCardPropsCombined, FeatureDescriptionCardProps>(
  connect(
    mapStateToProps,
    null
  ),
  translate('translation')
)(FeatureDescriptionCard);
