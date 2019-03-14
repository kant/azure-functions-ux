import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../../modules/types';
import { translate } from 'react-i18next';
import { fetchSiteRequest } from '../../../modules/site/actions';
import { SiteState } from '../../../modules/site/reducer';
import ChangeAppPlan from './ChangeAppPlan';
import { fetchResourceGroupsRequest } from '../../../modules/service/resource-groups/actions';
import { ResourceGroupsState } from '../../../modules/service/resource-groups/reducer';

export interface ChangeAppPlanLoaderProps {
  fetchSite: () => void;
  fetchResourceGroups: () => void;
  site: SiteState;
  resourceGroups: ResourceGroupsState;
}

export interface ChangeAppPlanLoaderState {}

class ChangeAppPlanDataLoaderOld extends React.Component<ChangeAppPlanLoaderProps, ChangeAppPlanLoaderState> {
  private _currentSiteId = '';

  constructor(props) {
    super(props);
    this.state = {};
  }

  public componentWillMount() {
    this.props.fetchSite();
    this.props.fetchResourceGroups();
  }

  public componentDidUpdate() {
    if (this.props.site.data.id !== this._currentSiteId) {
      this._currentSiteId = this.props.site.data.id;
    }
  }

  public render() {
    return (
      <>
        <ChangeAppPlan site={this.props.site} resourceGroups={this.props.resourceGroups} />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    site: state.site,
    resourceGroups: state.resourceGroups,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSite: () => dispatch(fetchSiteRequest()),
    fetchResourceGroups: () => dispatch(fetchResourceGroupsRequest()),
  };
};

export default compose(
  translate('translation'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ChangeAppPlanDataLoaderOld);
