import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './Dashboard.module.scss';
import '../../styles/slick.scss';
import '../../styles/slick-theme.scss';
import Slider from 'react-slick';
import {
  ActivityPanel,
  BountiesPanel,
  SubmissionsPanel,
  UserStats
} from 'containers';
import { getCurrentUserSelector } from 'public-modules/Authentication/selectors';
import { actions as activityActions } from 'public-modules/Activity';
import { actions as bountiesActions } from 'public-modules/Bounties';
import { actions as draftsActions } from 'public-modules/Drafts';
import { actions as userInfoActions } from 'public-modules/UserInfo';
import { SORT_CREATED } from 'public-modules/Bounties/constants';

import { actions as submissionsPanelActions } from 'containers/SubmissionsPanel/reducer';

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props);

    const {
      // general loaders
      loadActivity,
      loadBounties,
      loadDrafts,
      loadUserInfo,

      // bounties panel helpers
      resetState,
      addIssuerFilter,
      toggleStageFilter,
      setSort,
      public_address,

      // submissions panel helpers
      setActiveSubmissionsTab
    } = props;

    // load bounties panel
    resetState();
    addIssuerFilter(public_address);
    toggleStageFilter('active');
    setSort(SORT_CREATED, 'desc');
    loadBounties(true);
    loadDrafts();

    // load activity panel
    loadActivity(public_address);

    // load submissions panel
    loadUserInfo(public_address);
    setActiveSubmissionsTab('received');
  }

  componentDidMount() {
    // ensure dashboard is scrolled to the top on mount
    document.getElementsByClassName('page-body')[0].scrollTo(0, 0);
  }

  render() {
    var settings = {
      dots: true,
      arrows: false
    };
    return (
      <div>
        <div className={`pageWrapper-large ${styles.desktopContainer}`}>
          <UserStats className={styles.statsContainer} />
          <div className={styles.panelContainer}>
            <BountiesPanel
              className={styles.bountiesPanel}
              bodyClass={styles.bodyClass}
            />
            <ActivityPanel
              className={styles.activityPanel}
              bodyClass={styles.bodyClass}
            />
            <SubmissionsPanel
              className={styles.submissionsPanel}
              bodyClass={styles.bodyClass}
            />
          </div>
        </div>
        <div className={styles.mobileContainer}>
          <UserStats className={styles.statsContainer} />
          <Slider {...settings}>
            <BountiesPanel
              className={styles.bountiesPanel}
              bodyClass={styles.bodyClass}
            />
            <ActivityPanel
              className={styles.activityPanel}
              bodyClass={styles.bodyClass}
            />
            <SubmissionsPanel
              className={styles.submissionsPanel}
              bodyClass={styles.bodyClass}
            />
          </Slider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentUser = getCurrentUserSelector(state);
  const { public_address } = currentUser;

  return {
    public_address
  };
};

const Dashboard = compose(
  connect(
    mapStateToProps,
    {
      loadActivity: activityActions.loadActivity,
      loadBounties: bountiesActions.loadBounties,
      loadDrafts: draftsActions.loadDrafts,
      loadUserInfo: userInfoActions.loadUserInfo,
      resetState: bountiesActions.resetState,
      addIssuerFilter: bountiesActions.addIssuerFilter,
      toggleStageFilter: bountiesActions.toggleStageFilter,
      setSort: bountiesActions.setSort,
      setActiveSubmissionsTab: submissionsPanelActions.setActiveTab,

      activeLoadMore: bountiesActions.loadMoreBounties,
      draftsLoadMore: draftsActions.loadMoreDrafts
    }
  )
)(DashboardComponent);

export default Dashboard;
