import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { LoadComponent } from 'hocs';
import ProfileDetails from './ProfileDetails';
import ProfileBounties from './ProfileBounties';
import FilterNav from './FilterNav';
import styles from './Profile.module.scss';
import {
  userInfoSelector,
  loadedUserSelector,
  loadedUserStatsSelector
} from 'public-modules/UserInfo/selectors';
import { rootProfileUISelector } from './selectors';
import { actions as userInfoActions } from 'public-modules/UserInfo';
import { actions } from './reducer';

import { StickyContainer, Sticky } from 'react-sticky';

class ProfileComponent extends React.Component {
  componentWillMount() {
    this.props.setProfileAddress(this.props.match.params.address || '');
  }

  render() {
    return (
      <div className="fullHeight">
        <div className={`${styles.profileDetails}`}>
          <ProfileDetails />
        </div>
        <StickyContainer>
          <div className={styles.profileBounties}>
            <div className="row fullHeight">
              <div className={`col-xs-3 fullHeight`}>
                <Sticky topOffset={-50}>
                  {({ style }) => (
                    <div
                      className={styles.filterNav}
                      style={{
                        transform: style.transform,
                        position: style.position,
                        top: 50,
                        'max-width': '14.3rem'
                      }}
                    >
                      <FilterNav />
                    </div>
                  )}
                </Sticky>
              </div>
              <div className={`col-xs-9 fullHeight ${styles.explorerBody}`}>
                <ProfileBounties />
              </div>
            </div>
          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const Profile = compose(
  connect(
    mapStateToProps,
    { setProfileAddress: actions.setProfileAddress }
  )
)(ProfileComponent);

export default Profile;
